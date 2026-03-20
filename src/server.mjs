import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { URL } from "node:url";
import path from "node:path";
import { createSafetyService } from "./services/safety-service.mjs";
import { average, computeTrend } from "./services/trend-service.mjs";
import { makeNextStep } from "./services/next-step-service.mjs";
import { createProviderMatchingService } from "./services/provider-matching-service.mjs";
import { createDoctorSummaryService } from "./services/doctor-summary-service.mjs";
import { createStoreRepository } from "./repositories/store-repository.mjs";
import { createDoctorAuthService } from "./services/doctor-auth-service.mjs";
import { auditEventTypes, createAuditLogService } from "./services/audit-log-service.mjs";

function readBooleanEnv(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const normalized = String(raw).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

const PORT = process.env.PORT || 8787;
const HOST = process.env.HOST || "0.0.0.0";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const MAX_JSON_BODY_BYTES = Number(process.env.MAX_JSON_BODY_BYTES || 5 * 1024 * 1024);
const ROOT = process.cwd();
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, "data");
const DATA_STORE_PATH = process.env.DATA_STORE_PATH
  ? path.resolve(process.env.DATA_STORE_PATH)
  : path.join(DATA_DIR, "store.json");
const UPLOAD_DIR = process.env.UPLOAD_DIR ? path.resolve(process.env.UPLOAD_DIR) : path.join(DATA_DIR, "uploads");
const DOCTOR_SESSION_COOKIE = "doctor_session";
const DOCTOR_SESSION_HOURS = 12;
const DEFAULT_DOCTOR_DEMO_EMAIL = "doctor@example.com";
const DEFAULT_DOCTOR_DEMO_PASSWORD = "doctor1234";
const DOCTOR_DEMO_EMAIL = process.env.DOCTOR_DEMO_EMAIL || DEFAULT_DOCTOR_DEMO_EMAIL;
const DOCTOR_DEMO_PASSWORD = process.env.DOCTOR_DEMO_PASSWORD || DEFAULT_DOCTOR_DEMO_PASSWORD;
const DOCTOR_COOKIE_SECURE = readBooleanEnv("DOCTOR_COOKIE_SECURE", process.env.NODE_ENV === "production");
const STRICT_PROD_DOCTOR_CRED_GUARD = readBooleanEnv("STRICT_PROD_DOCTOR_CRED_GUARD", false);
const CONSENT_VERSION = String(process.env.CONSENT_VERSION || "consent_v1").trim() || "consent_v1";
const CONSENT_DEFAULT_SCOPES = ["daily_log", "profile", "doctor_share", "safety_check", "voice_transcribe"];

const safetyRulesPath = path.join(ROOT, "core/config/safety-rules-v0.1.json");
const symptomMapPath = path.join(ROOT, "core/config/symptom-category-map-v0.1.json");
const webIndexPath = path.join(ROOT, "web/index.html");
const webDoctorPath = path.join(ROOT, "web/doctor.html");
const webDoctorLoginPath = path.join(ROOT, "web/doctor-login.html");
const webAppPath = path.join(ROOT, "web/app.js");
const webDoctorAppPath = path.join(ROOT, "web/doctor.js");
const webDoctorLoginAppPath = path.join(ROOT, "web/doctor-login.js");
const webStylePath = path.join(ROOT, "web/styles.css");
const webManifestPath = path.join(ROOT, "web/manifest.webmanifest");
const webSwPath = path.join(ROOT, "web/sw.js");
const webOfflinePath = path.join(ROOT, "web/offline.html");
const webPrivacyPath = path.join(ROOT, "web/privacy.html");
const webTermsPath = path.join(ROOT, "web/terms.html");
const dataDirPath = DATA_DIR;
const dataStorePath = DATA_STORE_PATH;
const uploadDirPath = UPLOAD_DIR;
const MAX_IMAGE_BYTES = Number(process.env.MAX_IMAGE_BYTES || 3 * 1024 * 1024);
const LOGIN_RATE_LIMIT_ATTEMPTS = Number(process.env.DOCTOR_LOGIN_MAX_ATTEMPTS || 5);
const LOGIN_RATE_LIMIT_WINDOW_MS = Number(process.env.DOCTOR_LOGIN_WINDOW_MS || 10 * 60 * 1000);
const LOGIN_RATE_LIMIT_LOCK_MS = Number(process.env.DOCTOR_LOGIN_LOCK_MS || 15 * 60 * 1000);

const storeRepository = createStoreRepository({ dataDirPath, dataStorePath });

const providers = [
  {
    provider_id: "dr_001",
    name: "みなとメンタルクリニック",
    supported_categories: ["sleep_and_mood"],
    online_available: true,
    description_style_tags: ["丁寧説明"],
    next_available_at: "2026-03-05T10:30:00+09:00",
    phone: "03-5000-1001",
    booking_url: "https://example.com/booking/minato-mental",
    address: "東京都港区芝公園1-1-1",
    location: { lat: 35.6586, lng: 139.7454 }
  },
  {
    provider_id: "dr_002",
    name: "さくら内科",
    supported_categories: ["headache_and_fatigue", "digestive_issues"],
    online_available: false,
    description_style_tags: ["短時間重視"],
    next_available_at: "2026-03-05T09:00:00+09:00",
    phone: "03-5000-1002",
    booking_url: "https://example.com/booking/sakura-internal",
    address: "東京都千代田区神田1-2-3",
    location: { lat: 35.6918, lng: 139.7708 }
  },
  {
    provider_id: "dr_003",
    name: "しらかば皮膚科",
    supported_categories: ["skin_allergy"],
    online_available: true,
    description_style_tags: ["丁寧説明"],
    next_available_at: "2026-03-06T11:00:00+09:00",
    phone: "03-5000-1003",
    booking_url: "https://example.com/booking/shirakaba-skin",
    address: "東京都新宿区西新宿2-8-1",
    location: { lat: 35.6896, lng: 139.6921 }
  }
];

const requiredLogFields = [
  "user_id",
  "recorded_at",
  "symptoms",
  "symptom_score",
  "mood_score",
  "sleep_hours",
  "sleep_quality_score",
  "medication_status"
];

let safetyConfig;
let symptomConfig;
let safetyService;
let providerMatchingService;
let doctorSummaryService;
let doctorAuthService;
let auditLogService;

function isProductionLike() {
  return String(process.env.NODE_ENV || "").trim().toLowerCase() === "production";
}

function usingDefaultDoctorCredentials() {
  return DOCTOR_DEMO_EMAIL === DEFAULT_DOCTOR_DEMO_EMAIL && DOCTOR_DEMO_PASSWORD === DEFAULT_DOCTOR_DEMO_PASSWORD;
}

function enforceDoctorCredentialGuard() {
  if (!isProductionLike()) return;
  if (!usingDefaultDoctorCredentials()) return;
  const warning =
    "[SECURITY WARNING] NODE_ENV=production でデモ医師認証値(doctor@example.com / doctor1234)が使用されています。";
  // eslint-disable-next-line no-console
  console.warn(warning);
  if (STRICT_PROD_DOCTOR_CRED_GUARD) {
    const err = new Error("production_default_doctor_credentials_blocked");
    err.statusCode = 500;
    throw err;
  }
}

async function bootstrapConfig() {
  enforceDoctorCredentialGuard();
  await storeRepository.init();
  const [safetyRaw, symptomRaw] = await Promise.all([
    readFile(safetyRulesPath, "utf8"),
    readFile(symptomMapPath, "utf8")
  ]);
  safetyConfig = JSON.parse(safetyRaw);
  symptomConfig = JSON.parse(symptomRaw);
  safetyService = createSafetyService({ safetyConfig, makeAuditId });
  providerMatchingService = createProviderMatchingService({ symptomConfig, providers });
  doctorSummaryService = createDoctorSummaryService({
    getUserLogs,
    getProfile: (userId) => storeRepository.getProfile(userId) || {},
    evaluateSafety: safetyService.evaluateSafety,
    computeTrend,
    makeNextStep,
    matchProviders: providerMatchingService.matchProviders,
    average,
    calcAge,
    defaultDisclaimer: safetyConfig.default_disclaimer
  });
  doctorAuthService = createDoctorAuthService({
    repository: storeRepository,
    cookieName: DOCTOR_SESSION_COOKIE,
    sessionHours: DOCTOR_SESSION_HOURS,
    demoEmail: DOCTOR_DEMO_EMAIL,
    demoPassword: DOCTOR_DEMO_PASSWORD,
    maxAttempts: LOGIN_RATE_LIMIT_ATTEMPTS,
    windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
    lockMs: LOGIN_RATE_LIMIT_LOCK_MS,
    secureCookie: DOCTOR_COOKIE_SECURE
  });
  auditLogService = createAuditLogService({ repository: storeRepository });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    "Content-Type": `${contentType}; charset=utf-8`
  });
  res.end(body);
}

function sendBinary(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    "Content-Type": contentType
  });
  res.end(body);
}

function sendRedirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function sendJsonWithHeaders(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers
  });
  res.end(JSON.stringify(payload, null, 2));
}

function requestIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (forwarded) return forwarded;
  return String(req.socket?.remoteAddress || "unknown");
}

async function parseJsonBody(req) {
  const chunks = [];
  let totalSize = 0;
  for await (const chunk of req) {
    totalSize += chunk.length;
    if (totalSize > MAX_JSON_BODY_BYTES) {
      const error = new Error("payload_too_large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (_) {
    const error = new Error("invalid_json");
    error.statusCode = 400;
    throw error;
  }
}

function extensionFromImageMime(mimeType) {
  const mime = String(mimeType || "").toLowerCase();
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "";
}

function parseDataUrlImage(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;
  const mimeType = match[1].toLowerCase();
  const ext = extensionFromImageMime(mimeType);
  if (!ext) return null;
  const buffer = Buffer.from(match[2], "base64");
  return { mimeType, ext, buffer };
}

async function storeImageFromDataUrl(dataUrl, originalName = "") {
  const parsed = parseDataUrlImage(dataUrl);
  if (!parsed) {
    const err = new Error("invalid_image_data_url");
    err.statusCode = 400;
    throw err;
  }
  if (parsed.buffer.length > MAX_IMAGE_BYTES) {
    const err = new Error("image_too_large");
    err.statusCode = 413;
    throw err;
  }
  await mkdir(uploadDirPath, { recursive: true });
  const imageId = `img_${randomUUID()}`;
  const filename = `${imageId}.${parsed.ext}`;
  const absPath = path.join(uploadDirPath, filename);
  await writeFile(absPath, parsed.buffer);

  return {
    image_id: imageId,
    file_name: String(originalName || "").trim() || filename,
    mime_type: parsed.mimeType,
    size_bytes: parsed.buffer.length,
    url: `/uploads/${filename}`
  };
}

function makeAuditId() {
  return `aud_${randomUUID()}`;
}

function makeShareToken() {
  return randomUUID().replace(/-/g, "");
}

function confidenceFromData(recordsCount) {
  if (recordsCount >= 7) return "high";
  if (recordsCount >= 3) return "medium";
  return "low";
}

function parseGeoParam(raw) {
  const num = Number(raw);
  if (!Number.isFinite(num)) return null;
  return num;
}

function parseUserLocation(searchParams) {
  const lat = parseGeoParam(searchParams.get("lat"));
  const lng = parseGeoParam(searchParams.get("lng"));
  if (lat === null || lng === null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6))
  };
}

function insightEnvelope(payload, evidence, userLogCount) {
  return {
    ...payload,
    confidence: confidenceFromData(userLogCount),
    evidence,
    disclaimer: safetyConfig.default_disclaimer,
    audit_id: makeAuditId()
  };
}

function validateLogInput(body) {
  for (const key of requiredLogFields) {
    if (body[key] === undefined || body[key] === null) {
      return `missing field: ${key}`;
    }
  }
  if (typeof body.user_id !== "string" || !body.user_id.trim()) return "user_id must be non-empty string";
  if (typeof body.recorded_at !== "string" || Number.isNaN(Date.parse(body.recorded_at))) {
    return "recorded_at must be valid datetime";
  }
  if (!Array.isArray(body.symptoms)) return "symptoms must be array";
  if (body.symptoms.some((item) => typeof item !== "string" || !item.trim() || item.length > 40)) {
    return "symptoms items must be non-empty string (max 40)";
  }

  const symptomScore = Number(body.symptom_score);
  const moodScore = Number(body.mood_score);
  const sleepQualityScore = Number(body.sleep_quality_score);
  const sleepHours = Number(body.sleep_hours);

  if (!Number.isFinite(symptomScore) || symptomScore < 0 || symptomScore > 10) return "symptom_score out of range";
  if (!Number.isFinite(moodScore) || moodScore < 0 || moodScore > 10) return "mood_score out of range";
  if (!Number.isFinite(sleepQualityScore) || sleepQualityScore < 0 || sleepQualityScore > 10) {
    return "sleep_quality_score out of range";
  }
  if (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24) {
    return "sleep_hours out of range";
  }
  if (!["taken", "missed", "none", "unknown"].includes(String(body.medication_status || ""))) {
    return "medication_status is invalid";
  }
  if (body.note !== undefined && body.note !== null && typeof body.note !== "string") {
    return "note must be string";
  }
  if (body.sleep_start_time !== undefined && body.sleep_start_time !== null) {
    if (typeof body.sleep_start_time !== "string") return "sleep_start_time must be string";
    const value = String(body.sleep_start_time).trim();
    if (value && !isClockTimeString(value)) return "sleep_start_time must be HH:MM";
  }
  if (body.sleep_end_time !== undefined && body.sleep_end_time !== null) {
    if (typeof body.sleep_end_time !== "string") return "sleep_end_time must be string";
    const value = String(body.sleep_end_time).trim();
    if (value && !isClockTimeString(value)) return "sleep_end_time must be HH:MM";
  }
  if (body.image_data_url !== undefined && body.image_data_url !== null && typeof body.image_data_url !== "string") {
    return "image_data_url must be string";
  }
  if (body.log_id !== undefined && body.log_id !== null && typeof body.log_id !== "string") {
    return "log_id must be string";
  }
  if (body.image_name !== undefined && body.image_name !== null && typeof body.image_name !== "string") {
    return "image_name must be string";
  }
  if (typeof body.image_name === "string" && body.image_name.length > 120) {
    return "image_name too long";
  }
  return null;
}

function formatLocalDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function recordedAtDateKey(value) {
  const raw = String(value || "");
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return formatLocalDateKey(parsed);
  }
  return raw.slice(0, 10);
}

function isClockTimeString(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(String(value || ""));
}

function computeSleepHoursFromClockTimes(startTime, endTime) {
  if (!isClockTimeString(startTime) || !isClockTimeString(endTime)) return null;
  const [startHour, startMinute] = String(startTime).split(":").map(Number);
  const [endHour, endMinute] = String(endTime).split(":").map(Number);
  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;
  if (endTotal < startTotal) endTotal += 24 * 60;
  const minutes = endTotal - startTotal;
  return Math.max(0, Math.min(24, Math.round((minutes / 60) * 2) / 2));
}

function buildPraiseMessage(log) {
  if (!log) return "";
  const symptomScore = Number(log.symptom_score || 0);
  const moodScore = Number(log.mood_score || 0);
  const sleepQualityScore = Number(log.sleep_quality_score || 0);
  const sleepHours = Number(log.sleep_hours || 0);

  if (symptomScore <= 2 && moodScore >= 7 && sleepQualityScore >= 7 && sleepHours >= 6) {
    return "今日はかなり良い流れです。この調子で続けられていて、とても良いです。";
  }
  if (symptomScore <= 3 && moodScore >= 6) {
    return "今日は少し安定して過ごせています。ここまで記録を続けているのが良い流れです。";
  }
  if (moodScore >= 8) {
    return "気分が上向いていて良いですね。こういう日を記録できているのは大きいです。";
  }
  if (sleepQualityScore >= 8 || sleepHours >= 7.5) {
    return "しっかり休めた日として残せていて良いです。回復の手がかりになります。";
  }
  return "";
}

function normalizeDailyLogInput(input) {
  const body = input && typeof input === "object" ? input : {};
  const source = body.record && typeof body.record === "object" && !Array.isArray(body.record) ? body.record : body;
  const userIdRaw = source.user_id ?? source.userId ?? body.user_id ?? body.userId ?? "u_123";
  const recordedAtRaw = source.recorded_at ?? source.recordedAt ?? body.recorded_at ?? body.recordedAt;
  const symptomsRaw =
    source.symptoms ??
    source.symptom_list ??
    source.symptomList ??
    source.symptom ??
    body.symptoms ??
    body.symptom_list ??
    body.symptomList ??
    body.symptom;
  let symptoms = [];
  if (Array.isArray(symptomsRaw)) {
    symptoms = symptomsRaw;
  } else if (typeof symptomsRaw === "string") {
    symptoms = symptomsRaw.split(/[,、]/);
  } else if (symptomsRaw !== undefined && symptomsRaw !== null) {
    symptoms = [String(symptomsRaw)];
  }
  symptoms = symptoms
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .map((item) => item.slice(0, 40));

  const symptomScoreRaw = source.symptom_score ?? source.symptomScore ?? body.symptom_score ?? body.symptomScore;
  const moodScoreRaw = source.mood_score ?? source.moodScore ?? body.mood_score ?? body.moodScore;
  const sleepHoursRaw = source.sleep_hours ?? source.sleepHours ?? body.sleep_hours ?? body.sleepHours;
  const sleepStartTimeRaw =
    source.sleep_start_time ?? source.sleepStartTime ?? body.sleep_start_time ?? body.sleepStartTime ?? "";
  const sleepEndTimeRaw =
    source.sleep_end_time ?? source.sleepEndTime ?? body.sleep_end_time ?? body.sleepEndTime ?? "";
  const sleepQualityRaw =
    source.sleep_quality_score ??
    source.sleepQualityScore ??
    body.sleep_quality_score ??
    body.sleepQualityScore;
  const medicationRaw =
    source.medication_status ??
    source.medicationStatus ??
    body.medication_status ??
    body.medicationStatus ??
    "unknown";
  const noteRaw = source.note ?? source.memo ?? body.note ?? body.memo ?? "";
  const imageDataUrlRaw = source.image_data_url ?? source.imageDataUrl ?? body.image_data_url ?? body.imageDataUrl;
  const imageNameRaw = source.image_name ?? source.imageName ?? body.image_name ?? body.imageName;
  const logIdRaw = source.log_id ?? source.logId ?? body.log_id ?? body.logId;
  const imageClearRaw = source.image_clear ?? source.imageClear ?? body.image_clear ?? body.imageClear;
  const imageKeepRaw = source.image_keep ?? source.imageKeep ?? body.image_keep ?? body.imageKeep;

  const normalizedUserId = String(userIdRaw || "u_123").trim() || "u_123";
  const recordedAtCandidate = String(recordedAtRaw || "").trim();
  const normalizedRecordedAt = Number.isNaN(Date.parse(recordedAtCandidate)) ? new Date().toISOString() : recordedAtCandidate;
  const symptomScore = Number.isFinite(Number(symptomScoreRaw)) ? Number(symptomScoreRaw) : 5;
  const moodScore = Number.isFinite(Number(moodScoreRaw)) ? Number(moodScoreRaw) : 5;
  const sleepStartTime = String(sleepStartTimeRaw || "").trim();
  const sleepEndTime = String(sleepEndTimeRaw || "").trim();
  const autoSleepHours = computeSleepHoursFromClockTimes(sleepStartTime, sleepEndTime);
  const sleepHours = Number.isFinite(Number(autoSleepHours))
    ? Number(autoSleepHours)
    : Number.isFinite(Number(sleepHoursRaw))
      ? Number(sleepHoursRaw)
      : 7;
  const sleepQualityScore = Number.isFinite(Number(sleepQualityRaw)) ? Number(sleepQualityRaw) : 5;
  const medicationStatus = String(medicationRaw || "unknown").trim() || "unknown";
  return {
    user_id: normalizedUserId,
    recorded_at: normalizedRecordedAt,
    symptoms,
    symptom_score: Math.max(0, Math.min(10, symptomScore)),
    mood_score: Math.max(0, Math.min(10, moodScore)),
    sleep_hours: Math.max(0, Math.min(24, sleepHours)),
    sleep_start_time: sleepStartTime,
    sleep_end_time: sleepEndTime,
    sleep_quality_score: Math.max(0, Math.min(10, sleepQualityScore)),
    medication_status: ["taken", "missed", "none", "unknown"].includes(medicationStatus) ? medicationStatus : "unknown",
    note: String(noteRaw || ""),
    log_id: logIdRaw ? String(logIdRaw).trim() : undefined,
    image_clear: Boolean(imageClearRaw),
    image_keep: Boolean(imageKeepRaw),
    image_data_url: imageDataUrlRaw,
    image_name: imageNameRaw
  };
}

function normalizeConsentScopes(raw) {
  if (!Array.isArray(raw)) return CONSENT_DEFAULT_SCOPES.slice();
  const normalized = raw
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 20);
  return normalized.length ? Array.from(new Set(normalized)) : CONSENT_DEFAULT_SCOPES.slice();
}

function sanitizeConsentInput(body, meta = {}) {
  const userId = String(body.user_id || "").trim();
  if (!userId) {
    const err = new Error("missing user_id");
    err.statusCode = 400;
    throw err;
  }
  const consentVersion = String(body.consent_version || CONSENT_VERSION).trim() || CONSENT_VERSION;
  const policyVersion = String(body.policy_version || consentVersion).trim() || consentVersion;
  const source = String(body.source || "in_app_modal").trim().slice(0, 60) || "in_app_modal";
  const note = String(body.note || "").trim().slice(0, 300);
  return {
    consent_id: `cns_${randomUUID()}`,
    user_id: userId,
    agreed: Boolean(body.agreed),
    consent_version: consentVersion,
    policy_version: policyVersion,
    scopes: normalizeConsentScopes(body.scopes),
    source,
    note,
    ip_address: String(meta.ipAddress || ""),
    user_agent: String(meta.userAgent || "").slice(0, 300),
    agreed_at: new Date().toISOString()
  };
}

function isConsentAccepted(consent) {
  if (!consent) return false;
  if (!consent.agreed) return false;
  return String(consent.consent_version || "") === CONSENT_VERSION;
}

function consentResponseEnvelope(consent) {
  return {
    required: {
      consent_version: CONSENT_VERSION,
      scopes: CONSENT_DEFAULT_SCOPES
    },
    accepted: isConsentAccepted(consent),
    consent: consent || null
  };
}

function requireConsentForWrite(userId, res) {
  const latestConsent = storeRepository.getLatestConsentByUser(userId);
  if (isConsentAccepted(latestConsent)) return latestConsent;
  sendJson(res, 428, {
    error: "consent_required",
    message: "データ保存の前に利用同意が必要です。",
    ...consentResponseEnvelope(latestConsent)
  });
  return null;
}

function getUserLogs(userId) {
  return storeRepository.listUserLogs(userId);
}

function calcAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

function isShareLinkExpired(link) {
  return new Date(link.expires_at).getTime() < Date.now();
}

function shareLinkStatus(link) {
  if (link.revoked_at) return "revoked";
  if (isShareLinkExpired(link)) return "expired";
  return "active";
}

function daysSince(isoText, nowMs = Date.now()) {
  const t = new Date(String(isoText || "")).getTime();
  if (!Number.isFinite(t)) return 0;
  const diff = Math.floor((nowMs - t) / (24 * 60 * 60 * 1000));
  return Math.max(0, diff);
}

function doctorQueueTier(score) {
  if (score >= 80) return { code: "urgent", label: "最優先" };
  if (score >= 55) return { code: "high", label: "高" };
  if (score >= 30) return { code: "medium", label: "中" };
  return { code: "low", label: "低" };
}

function scoreDoctorQueue(summary, nowMs = Date.now()) {
  const triage = summary?.triage || {};
  const latest = summary?.latest_record || {};
  const scoreReasons = [];
  let score = 0;

  const risk = String(triage.risk_level || "low");
  if (risk === "high") {
    score += 55;
    scoreReasons.push("高リスク判定");
  } else if (risk === "medium") {
    score += 28;
    scoreReasons.push("中リスク判定");
  }

  const trend = String(triage.trend || "stable");
  if (trend === "worsening") {
    score += 20;
    scoreReasons.push("悪化傾向");
  } else if (trend === "stable") {
    score += 8;
  }

  const symptomScore = Number(latest.symptom_score || 0);
  if (symptomScore >= 8) {
    score += 18;
    scoreReasons.push(`症状スコア高め(${symptomScore})`);
  } else if (symptomScore >= 6) {
    score += 10;
  }

  const moodScore = Number(latest.mood_score || 0);
  if (moodScore <= 2) {
    score += 15;
    scoreReasons.push(`気分スコア低め(${moodScore})`);
  } else if (moodScore <= 4) {
    score += 8;
  }

  const sleepHours = Number(latest.sleep_hours || 0);
  if (sleepHours > 0 && sleepHours < 4) {
    score += 10;
    scoreReasons.push(`睡眠不足(${sleepHours}h)`);
  } else if (sleepHours > 0 && sleepHours < 6) {
    score += 6;
  }

  const staleDays = daysSince(latest.recorded_at, nowMs);
  if (staleDays >= 3) {
    score += 7;
    scoreReasons.push(`${staleDays}日間更新なし`);
  }

  return {
    score: Math.min(99, score),
    reasons: scoreReasons.slice(0, 4)
  };
}

function buildDoctorQueueItems(windowDays = 14) {
  const nowMs = Date.now();
  const links = storeRepository.listShareLinks();
  const latestActiveLinkByUser = new Map();

  for (const link of links) {
    if (shareLinkStatus(link) !== "active") continue;
    const userId = String(link.user_id || "").trim();
    if (!userId) continue;
    const prev = latestActiveLinkByUser.get(userId);
    if (!prev || new Date(link.created_at).getTime() > new Date(prev.created_at).getTime()) {
      latestActiveLinkByUser.set(userId, link);
    }
  }

  const items = [];
  for (const [userId, link] of latestActiveLinkByUser.entries()) {
    try {
      const summary = doctorSummaryService.buildDoctorSummary(userId, windowDays);
      const scored = scoreDoctorQueue(summary, nowMs);
      const tier = doctorQueueTier(scored.score);
      const latest = summary.latest_record || {};
      const patient = summary.patient || {};
      items.push({
        user_id: userId,
        display_name: patient.display_name || "",
        risk_level: summary?.triage?.risk_level || "low",
        trend: summary?.triage?.trend || "stable",
        priority_score: scored.score,
        priority_tier: tier.code,
        priority_label: tier.label,
        priority_reasons: scored.reasons,
        last_recorded_at: latest.recorded_at || "",
        symptom_score: latest.symptom_score ?? null,
        mood_score: latest.mood_score ?? null,
        share_kind: link.kind || "patient_share",
        share_id: link.share_id,
        doctor_url: `/doctor?token=${encodeURIComponent(link.token)}`
      });
    } catch (_) {
      // Ignore users with no readable logs.
    }
  }

  items.sort((a, b) => {
    if (b.priority_score !== a.priority_score) return b.priority_score - a.priority_score;
    return new Date(b.last_recorded_at).getTime() - new Date(a.last_recorded_at).getTime();
  });

  return items;
}

function toDoctorShareLinkItem(link) {
  return {
    share_id: link.share_id,
    kind: link.kind || "patient_share",
    status: shareLinkStatus(link),
    created_at: link.created_at,
    expires_at: link.expires_at,
    revoked_at: link.revoked_at,
    doctor_url: `/doctor?token=${encodeURIComponent(link.token)}`,
    handoff_to: link.handoff_to || "",
    share_target_label: link.share_target_label || "",
    handoff_note: link.handoff_note || "",
    issued_by_doctor_id: link.issued_by_doctor_id || "",
    issued_by_doctor_name: link.issued_by_doctor_name || "",
    source_share_id: link.source_share_id || null
  };
}

function findShareByToken(token) {
  return storeRepository.findShareByToken(token);
}

function findShareById(shareId) {
  return storeRepository.findShareById(shareId);
}

async function requireDoctorSession(req, res) {
  const result = doctorAuthService.resolveSession(req);
  if (result.ok) {
    if (!result.session?.doctor_id) {
      sendJson(res, 403, {
        error: "doctor_access_forbidden",
        message: "この医師アカウントにはアクセス権限がありません。"
      });
      return null;
    }
    return result.session;
  }
  if (result.reason === "expired") {
    await storeRepository.persist();
  }
  const error = doctorAuthService.authErrorPayload(result.reason);
  const headers = result.clearCookie ? { "Set-Cookie": doctorAuthService.buildClearedSessionCookie() } : {};
  sendJsonWithHeaders(res, error.status, error.body, headers);
  return null;
}

function invalidShareTokenPayload() {
  return {
    status: 404,
    payload: {
      error: "share_token_invalid",
      message: "共有トークンが無効です。患者さんに共有リンクの再発行を依頼してください。"
    }
  };
}

function inactiveShareTokenPayload(reason) {
  return {
    status: 410,
    payload: {
      error: "share_link_inactive",
      message: "共有リンクの有効期限が切れたか失効しています。患者さんに再発行を依頼してください。",
      reason
    }
  };
}

function resolveActiveShareLink(token) {
  const normalizedToken = String(token || "").trim();
  if (!normalizedToken) {
    return { ok: false, ...invalidShareTokenPayload() };
  }
  if (!/^[a-f0-9]{32}$/.test(normalizedToken)) {
    return { ok: false, ...invalidShareTokenPayload() };
  }
  const link = findShareByToken(normalizedToken);
  if (!link) {
    return { ok: false, ...invalidShareTokenPayload() };
  }
  const status = shareLinkStatus(link);
  if (status !== "active") {
    return { ok: false, ...inactiveShareTokenPayload(status) };
  }
  return { ok: true, link };
}

function buildCalendarItems(userLogs, month) {
  const map = new Map();
  for (const log of userLogs) {
    const day = recordedAtDateKey(log.recorded_at);
    if (!day.startsWith(month)) continue;
    if (!map.has(day)) {
      map.set(day, {
        date: day,
        count: 0,
        symptom_avg: 0,
        mood_avg: 0
      });
    }
    const cur = map.get(day);
    cur.count += 1;
    cur.symptom_avg += Number(log.symptom_score || 0);
    cur.mood_avg += Number(log.mood_score || 0);
  }
  return Array.from(map.values())
    .map((item) => ({
      ...item,
      symptom_avg: Number((item.symptom_avg / item.count).toFixed(1)),
      mood_avg: Number((item.mood_avg / item.count).toFixed(1))
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getStats(userLogs) {
  const uniqueDates = Array.from(
    new Set(userLogs.map((log) => recordedAtDateKey(log.recorded_at)))
  ).sort((a, b) => a.localeCompare(b));
  const totalDays = uniqueDates.length;
  const totalLogs = userLogs.length;

  let streak = 0;
  if (uniqueDates.length) {
    let cursor = new Date(`${uniqueDates[uniqueDates.length - 1]}T00:00:00`);
    for (let i = uniqueDates.length - 1; i >= 0; i -= 1) {
      const day = new Date(`${uniqueDates[i]}T00:00:00`);
      const diff = Math.round((cursor - day) / (24 * 60 * 60 * 1000));
      if (diff === 0) {
        streak += 1;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
        continue;
      }
      break;
    }
  }
  return { total_logs: totalLogs, total_days: totalDays, streak_days: streak };
}

function isoAtLocalNoon(dateObj) {
  const d = new Date(dateObj);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

function generateDemoLogs({ userId, days = 30 }) {
  const symptomsPool = ["頭痛", "不眠", "だるさ", "不安感", "吐き気", "肩こり"];
  const logs = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const wave = Math.sin((i / 6) * Math.PI);
    const symptomScore = Math.max(2, Math.min(9, Math.round(5 + wave * 2 + (Math.random() * 2 - 1))));
    const moodScore = Math.max(2, Math.min(9, Math.round(6 - wave * 2 + (Math.random() * 2 - 1))));
    const sleepQuality = Math.max(2, Math.min(9, Math.round(5.5 - wave * 1.8 + (Math.random() * 1.5 - 0.75))));
    const sleepHours = Number((6 + Math.cos((i / 5) * Math.PI) * 1.2 + (Math.random() * 0.8 - 0.4)).toFixed(1));
    const pickedSymptoms = symptomsPool.filter((_, idx) => (idx + i) % 3 === 0).slice(0, 2);
    const note = symptomScore >= 7 ? "午後にしんどさが強め。早めに休む。" : "無理せず過ごせた。";
    logs.push({
      log_id: `demo_${randomUUID()}`,
      user_id: userId,
      recorded_at: isoAtLocalNoon(day),
      symptoms: pickedSymptoms.length ? pickedSymptoms : ["だるさ"],
      symptom_score: symptomScore,
      mood_score: moodScore,
      sleep_hours: Math.max(3, Math.min(9, sleepHours)),
      sleep_quality_score: sleepQuality,
      medication_status: i % 7 === 0 ? "missed" : "taken",
      note,
      created_at: new Date().toISOString()
    });
  }
  return logs;
}

function sanitizeProfileInput(body) {
  const profile = {
    display_name: String(body.display_name || "").trim(),
    height_cm: body.height_cm === "" || body.height_cm === undefined ? null : Number(body.height_cm),
    weight_kg: body.weight_kg === "" || body.weight_kg === undefined ? null : Number(body.weight_kg),
    birth_date: String(body.birth_date || "").trim(),
    sex: String(body.sex || "").trim(),
    chronic_conditions: String(body.chronic_conditions || "").trim(),
    note: String(body.note || "").trim()
  };

  if (profile.height_cm !== null && (Number.isNaN(profile.height_cm) || profile.height_cm < 50 || profile.height_cm > 260)) {
    const err = new Error("invalid_height_cm");
    err.statusCode = 400;
    throw err;
  }
  if (profile.weight_kg !== null && (Number.isNaN(profile.weight_kg) || profile.weight_kg < 10 || profile.weight_kg > 300)) {
    const err = new Error("invalid_weight_kg");
    err.statusCode = 400;
    throw err;
  }
  if (profile.chronic_conditions.length > 600) {
    const err = new Error("invalid_chronic_conditions");
    err.statusCode = 400;
    throw err;
  }
  return profile;
}

function extensionFromMime(mimeType) {
  if (!mimeType) return "webm";
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("mpeg")) return "mp3";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

async function transcribeAudioWithOpenAI(audioBase64, mimeType) {
  const audioBuffer = Buffer.from(audioBase64, "base64");
  const ext = extensionFromMime(mimeType);
  const form = new FormData();
  const blob = new Blob([audioBuffer], { type: mimeType || "audio/webm" });
  form.append("file", blob, `voice.${ext}`);
  form.append("model", "gpt-4o-mini-transcribe");
  form.append("language", "ja");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let response;
  try {
    response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: form,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`openai_transcription_failed: ${response.status} ${errBody}`);
  }

  const data = await response.json();
  return String(data.text || "").trim();
}

const server = createServer(async (req, res) => {
  try {
    if (!req.url) {
      return sendJson(res, 400, { error: "invalid url" });
    }
    const requestUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = requestUrl.pathname;
    const method = req.method || "GET";

    if (method === "GET" && pathname === "/health") {
      return sendJson(res, 200, { status: "ok" });
    }

    if (method === "GET" && pathname === "/api/v1/system/status") {
      return sendJson(res, 200, {
        status: "ok",
        time: new Date().toISOString(),
        config: {
          host: HOST,
          port: Number(PORT),
          max_json_body_bytes: MAX_JSON_BODY_BYTES,
          voice_transcribe_enabled: Boolean(OPENAI_API_KEY),
          data_dir: dataDirPath,
          consent_version: CONSENT_VERSION,
          strict_prod_doctor_cred_guard: STRICT_PROD_DOCTOR_CRED_GUARD,
          production_default_doctor_credentials: isProductionLike() && usingDefaultDoctorCredentials()
        }
      });
    }

    if (method === "GET" && pathname === "/api/v1/doctor/auth/me") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      return sendJson(res, 200, {
        doctor: {
          doctor_id: session.doctor_id,
          email: session.email,
          display_name: session.display_name
        }
      });
    }

    if (method === "POST" && pathname === "/api/v1/doctor/auth/login") {
      const body = await parseJsonBody(req);
      const email = String(body.email || "").trim();
      const password = String(body.password || "");
      const rateLimit = doctorAuthService.checkRateLimit(req, email);
      if (rateLimit.limited) {
        auditLogService.record({
          eventType: auditEventTypes.doctorLoginFailure,
          actor: "anonymous",
          target: "doctor_auth",
          metadata: {
            reason: "rate_limited",
            ip: requestIp(req),
            retry_after_seconds: rateLimit.retry_after_seconds
          }
        });
        await storeRepository.persist();
        return sendJsonWithHeaders(
          res,
          429,
          {
            error: "too_many_login_attempts",
            message: "ログイン試行回数が上限に達しました。しばらく待ってから再試行してください。"
          },
          { "Retry-After": String(rateLimit.retry_after_seconds) }
        );
      }

      const doctor = doctorAuthService.authenticate(email, password);
      if (!doctor) {
        const failed = doctorAuthService.recordLoginFailure(req, email);
        auditLogService.record({
          eventType: auditEventTypes.doctorLoginFailure,
          actor: "anonymous",
          target: "doctor_auth",
          metadata: {
            reason: "invalid_credentials",
            ip: requestIp(req),
            attempts: failed.attempts
          }
        });
        await storeRepository.persist();
        return sendJson(res, 401, {
          error: "invalid_credentials",
          message: "メールアドレスまたはパスワードが違います。再入力してください。"
        });
      }

      doctorAuthService.recordLoginSuccess(req, email);
      const session = doctorAuthService.issueSession(doctor);
      auditLogService.record({
        eventType: auditEventTypes.doctorLoginSuccess,
        actor: session.doctor_id,
        target: session.session_id,
        metadata: {
          session_expires_at: session.expires_at
        }
      });
      await storeRepository.persist();
      return sendJsonWithHeaders(
        res,
        200,
        {
          status: "ok",
          doctor: {
            doctor_id: session.doctor_id,
            email: session.email,
            display_name: session.display_name
          }
        },
        { "Set-Cookie": doctorAuthService.buildSessionCookie(session.session_id) }
      );
    }

    if (method === "POST" && pathname === "/api/v1/doctor/auth/logout") {
      const result = doctorAuthService.resolveSession(req);
      if (result.ok) {
        doctorAuthService.revokeSessionById(result.session.session_id);
        await storeRepository.persist();
      } else if (result.reason === "expired") {
        await storeRepository.persist();
      }
      return sendJsonWithHeaders(
        res,
        200,
        { status: "ok" },
        { "Set-Cookie": doctorAuthService.buildClearedSessionCookie() }
      );
    }

    if (method === "GET" && pathname === "/api/v1/consent/latest") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const consent = storeRepository.getLatestConsentByUser(userId);
      if (!consent) {
        return sendJson(res, 404, {
          error: "consent_not_found",
          message: "利用同意がまだ登録されていません。",
          ...consentResponseEnvelope(null)
        });
      }
      return sendJson(res, 200, consentResponseEnvelope(consent));
    }

    if (method === "POST" && pathname === "/api/v1/consent") {
      const body = await parseJsonBody(req);
      const consent = sanitizeConsentInput(body, {
        ipAddress: requestIp(req),
        userAgent: req.headers["user-agent"]
      });
      storeRepository.addConsent(consent);
      await storeRepository.persist();
      return sendJson(res, 200, {
        status: "saved",
        ...consentResponseEnvelope(consent)
      });
    }

    if (method === "GET" && pathname === "/api/v1/profile") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      return sendJson(res, 200, { user_id: userId, profile: storeRepository.getProfile(userId) || null });
    }

    if (method === "POST" && pathname === "/api/v1/profile") {
      const body = await parseJsonBody(req);
      if (!body.user_id) return sendJson(res, 400, { error: "missing user_id" });
      const userId = String(body.user_id || "").trim();
      if (!requireConsentForWrite(userId, res)) return;
      const profile = sanitizeProfileInput(body);
      const savedProfile = storeRepository.setProfile(userId, {
        ...profile,
        updated_at: new Date().toISOString()
      });
      await storeRepository.persist();
      return sendJson(res, 200, { status: "saved", user_id: userId, profile: savedProfile });
    }

    if (method === "GET" && pathname === "/api/v1/user/export") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const logs = getUserLogs(userId);
      const insights = storeRepository.listInsightsByUser(userId);
      const safetyEvents = storeRepository.listSafetyEventsByUser(userId);
      const doctorNotes = storeRepository.listDoctorNotesByUser(userId);
      const consents = storeRepository.listConsentsByUser(userId);
      const profile = storeRepository.getProfile(userId);
      return sendJson(res, 200, {
        exported_at: new Date().toISOString(),
        user_id: userId,
        profile,
        consents,
        logs,
        insights,
        safety_events: safetyEvents,
        doctor_notes: doctorNotes
      });
    }

    if (method === "GET" && pathname === "/api/v1/share/doctor-summary") {
      const userId = requestUrl.searchParams.get("user_id");
      const windowDays = Number(requestUrl.searchParams.get("window_days") || "14");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const summary = doctorSummaryService.buildDoctorSummary(userId, windowDays);
      return sendJson(res, 200, summary);
    }

    if (method === "POST" && pathname === "/api/v1/share-links") {
      const body = await parseJsonBody(req);
      const userId = String(body.user_id || "").trim();
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      if (!requireConsentForWrite(userId, res)) return;
      const expiresHours = Math.max(1, Math.min(72, Number(body.expires_hours || 24)));
      const windowDays = Math.max(7, Math.min(90, Number(body.window_days || 14)));
      const shareTargetLabel = String(body.share_target_label || "").trim().slice(0, 80);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + expiresHours * 60 * 60 * 1000).toISOString();
      const link = {
        share_id: `shr_${randomUUID()}`,
        token: makeShareToken(),
        kind: "patient_share",
        user_id: userId,
        share_target_label: shareTargetLabel,
        window_days: windowDays,
        created_at: now.toISOString(),
        expires_at: expiresAt,
        revoked_at: null
      };
      storeRepository.addShareLink(link);
      auditLogService.record({
        eventType: auditEventTypes.shareLinkIssued,
        actor: userId,
        target: link.share_id,
        metadata: {
          expires_at: link.expires_at,
          window_days: link.window_days,
          share_target_label: link.share_target_label || ""
        }
      });
      await storeRepository.persist();
      return sendJson(res, 200, {
        status: "created",
        share_id: link.share_id,
        token: link.token,
        expires_at: link.expires_at,
        doctor_url: `/doctor?token=${encodeURIComponent(link.token)}`
      });
    }

    if (method === "GET" && pathname === "/api/v1/share-links") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const includeRevoked = String(requestUrl.searchParams.get("include_revoked") || "").trim().toLowerCase() === "true";
      const items = storeRepository
        .listShareLinksByUser(userId)
        .filter((link) => link.user_id === userId)
        .filter((link) => (includeRevoked ? true : !link.revoked_at))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((link) => {
          const accesses = storeRepository.listShareAccessLogsByShareId(link.share_id);
          const lastAccess = accesses.length
            ? accesses.slice().sort((a, b) => new Date(b.accessed_at) - new Date(a.accessed_at))[0]
            : null;
          return {
            ...toDoctorShareLinkItem(link),
            access_count: accesses.length,
            last_access_at: lastAccess ? lastAccess.accessed_at : null
          };
        });
      return sendJson(res, 200, { items });
    }

    if (method === "POST" && pathname === "/api/v1/share-links/revoke-all") {
      const body = await parseJsonBody(req);
      const userId = String(body.user_id || "").trim();
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const nowIso = new Date().toISOString();
      const links = storeRepository.listShareLinksByUser(userId).filter((link) => link.user_id === userId);
      const nonRevokedLinks = links.filter((link) => !link.revoked_at);
      const activeLinks = nonRevokedLinks.filter((link) => shareLinkStatus(link) === "active");
      const expiredLinks = nonRevokedLinks.filter((link) => shareLinkStatus(link) === "expired");

      let revoked = 0;
      for (const link of nonRevokedLinks) {
        const changed = storeRepository.revokeShareLink(link.share_id, nowIso);
        if (!changed) continue;
        revoked += 1;
        auditLogService.record({
          eventType: auditEventTypes.shareLinkRevoked,
          actor: userId,
          target: link.share_id,
          metadata: { bulk: true }
        });
      }
      await storeRepository.persist();
      return sendJson(res, 200, {
        status: "ok",
        user_id: userId,
        total_found: links.length,
        non_revoked_found: nonRevokedLinks.length,
        active_found: activeLinks.length,
        expired_found: expiredLinks.length,
        revoked
      });
    }

    if (method === "DELETE" && pathname.startsWith("/api/v1/share-links/")) {
      const shareId = pathname.replace("/api/v1/share-links/", "");
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      if (!shareId) return sendJson(res, 400, { error: "missing share_id" });
      const link = findShareById(shareId);
      if (!link || link.user_id !== userId) return sendJson(res, 404, { error: "share_link_not_found" });
      const wasRevoked = Boolean(link.revoked_at);
      const revoked = storeRepository.revokeShareLink(shareId, new Date().toISOString());
      if (!wasRevoked && revoked) {
        auditLogService.record({
          eventType: auditEventTypes.shareLinkRevoked,
          actor: userId,
          target: shareId,
          metadata: {}
        });
        await storeRepository.persist();
      }
      return sendJson(res, 200, { status: "revoked", share_id: shareId, revoked_at: revoked?.revoked_at || link.revoked_at });
    }

    if (method === "GET" && pathname === "/api/v1/doctor/view") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      const token = requestUrl.searchParams.get("token");
      const resolved = resolveActiveShareLink(token);
      if (!resolved.ok) return sendJson(res, resolved.status, resolved.payload);
      const { link } = resolved;
      const summary = doctorSummaryService.buildDoctorSummary(link.user_id, link.window_days || 14);
      storeRepository.addShareAccessLog({
        access_id: `acc_${randomUUID()}`,
        share_id: link.share_id,
        user_id: link.user_id,
        doctor_id: session.doctor_id,
        doctor_name: session.display_name,
        accessed_at: new Date().toISOString(),
        user_agent: String(req.headers["user-agent"] || ""),
        audit_id: makeAuditId()
      });
      auditLogService.record({
        eventType: auditEventTypes.doctorViewRead,
        actor: session.doctor_id,
        target: link.share_id,
        metadata: {
          window_days: link.window_days || 14
        }
      });
      await storeRepository.persist();
      return sendJson(res, 200, {
        share: {
          share_id: link.share_id,
          kind: link.kind || "patient_share",
          created_at: link.created_at,
          expires_at: link.expires_at,
          share_target_label: link.share_target_label || "",
          handoff_to: link.handoff_to || "",
          handoff_note: link.handoff_note || "",
          issued_by_doctor_name: link.issued_by_doctor_name || "",
          source_share_id: link.source_share_id || null
        },
        summary
      });
    }

    if (method === "POST" && pathname === "/api/v1/doctor/notes") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      const body = await parseJsonBody(req);
      const token = String(body.token || "");
      const note = String(body.note || "").trim();
      const authorInput = String(body.author || "").trim();
      if (!note) return sendJson(res, 400, { error: "missing note" });
      const resolved = resolveActiveShareLink(token);
      if (!resolved.ok) return sendJson(res, resolved.status, resolved.payload);
      const { link } = resolved;

      const doctorNote = {
        note_id: `dnote_${randomUUID()}`,
        share_id: link.share_id,
        user_id: link.user_id,
        doctor_id: session.doctor_id,
        author: authorInput || session.display_name || "担当医",
        note,
        created_at: new Date().toISOString()
      };
      storeRepository.addDoctorNote(doctorNote);
      auditLogService.record({
        eventType: auditEventTypes.doctorCommentSaved,
        actor: session.doctor_id,
        target: link.share_id,
        metadata: {
          note_id: doctorNote.note_id
        }
      });
      await storeRepository.persist();
      return sendJson(res, 200, { status: "saved", item: doctorNote });
    }

    if (method === "POST" && pathname === "/api/v1/doctor/handoffs") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      const body = await parseJsonBody(req);
      const token = String(body.token || "");
      const resolved = resolveActiveShareLink(token);
      if (!resolved.ok) return sendJson(res, resolved.status, resolved.payload);
      const { link } = resolved;

      const expiresHours = Math.max(1, Math.min(72, Number(body.expires_hours || 24)));
      const windowDays = Math.max(7, Math.min(90, Number(body.window_days || link.window_days || 14)));
      const handoffTo = String(body.handoff_to || "").trim().slice(0, 80);
      const handoffNote = String(body.handoff_note || "").trim().slice(0, 500);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + expiresHours * 60 * 60 * 1000).toISOString();
      const handoffLink = {
        share_id: `shr_${randomUUID()}`,
        token: makeShareToken(),
        kind: "doctor_handoff",
        user_id: link.user_id,
        window_days: windowDays,
        created_at: now.toISOString(),
        expires_at: expiresAt,
        revoked_at: null,
        source_share_id: link.share_id,
        issued_by_doctor_id: session.doctor_id,
        issued_by_doctor_name: session.display_name || session.email || "担当医",
        handoff_to: handoffTo,
        handoff_note: handoffNote
      };
      storeRepository.addShareLink(handoffLink);
      auditLogService.record({
        eventType: auditEventTypes.doctorHandoffIssued,
        actor: session.doctor_id,
        target: handoffLink.share_id,
        metadata: {
          source_share_id: link.share_id,
          expires_at: handoffLink.expires_at,
          window_days: handoffLink.window_days
        }
      });
      await storeRepository.persist();
      return sendJson(res, 200, {
        status: "created",
        item: toDoctorShareLinkItem(handoffLink)
      });
    }

    if (method === "GET" && pathname === "/api/v1/doctor/handoffs") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      const token = String(requestUrl.searchParams.get("token") || "");
      const resolved = resolveActiveShareLink(token);
      if (!resolved.ok) return sendJson(res, resolved.status, resolved.payload);
      const { link } = resolved;

      const items = storeRepository
        .listShareLinksByUser(link.user_id)
        .filter((item) => item.kind === "doctor_handoff")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((item) => toDoctorShareLinkItem(item))
        .slice(0, 20);
      return sendJson(res, 200, { items });
    }

    if (method === "GET" && pathname === "/api/v1/doctor/queue") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      const windowDays = Math.max(7, Math.min(30, Number(requestUrl.searchParams.get("window_days") || 14)));
      const items = buildDoctorQueueItems(windowDays);
      return sendJson(res, 200, {
        generated_at: new Date().toISOString(),
        window_days: windowDays,
        total: items.length,
        counts: {
          urgent: items.filter((item) => item.priority_tier === "urgent").length,
          high: items.filter((item) => item.priority_tier === "high").length,
          medium: items.filter((item) => item.priority_tier === "medium").length,
          low: items.filter((item) => item.priority_tier === "low").length
        },
        items
      });
    }

    if (method === "GET" && pathname === "/api/v1/patient/doctor-notes") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const items = storeRepository
        .listDoctorNotesByUser(userId)
        .filter((item) => item.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 30);
      return sendJson(res, 200, { items });
    }

    if (method === "POST" && pathname === "/api/v1/dev/seed-demo") {
      const body = await parseJsonBody(req);
      const userId = String(body.user_id || "");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const clearExisting = Boolean(body.clear_existing ?? true);
      const days = Number(body.days || 30);
      if (clearExisting) {
        storeRepository.removeLogsByUser(userId);
        storeRepository.removeInsightsByUser(userId);
        storeRepository.removeSafetyEventsByUser(userId);
        storeRepository.removeConsentsByUser(userId);
        storeRepository.removeShareLinksByUser(userId);
        storeRepository.removeShareAccessLogsByUser(userId);
        storeRepository.removeDoctorNotesByUser(userId);
      }
      const seededLogs = generateDemoLogs({ userId, days: Math.max(7, Math.min(120, days)) });
      for (const item of seededLogs) {
        storeRepository.addLog(item);
      }
      storeRepository.setProfile(userId, {
        display_name: "デモユーザー",
        height_cm: 171,
        weight_kg: 63.5,
        birth_date: "1995-06-21",
        sex: "other",
        chronic_conditions: "花粉症（春）",
        note: "デモ表示用のプロフィール",
        updated_at: new Date().toISOString()
      });
      storeRepository.addConsent({
        consent_id: `cns_${randomUUID()}`,
        user_id: userId,
        agreed: true,
        consent_version: CONSENT_VERSION,
        policy_version: CONSENT_VERSION,
        scopes: CONSENT_DEFAULT_SCOPES.slice(),
        source: "seed_demo",
        note: "seed demo",
        ip_address: "seed",
        user_agent: "seed",
        agreed_at: new Date().toISOString()
      });
      await storeRepository.persist();
      return sendJson(res, 200, { status: "seeded", user_id: userId, logs_count: seededLogs.length });
    }

    if (method === "GET" && pathname === "/") {
      const html = await readFile(webIndexPath, "utf8");
      return sendText(res, 200, html, "text/html");
    }

    if (method === "GET" && pathname === "/doctor-login") {
      const html = await readFile(webDoctorLoginPath, "utf8");
      return sendText(res, 200, html, "text/html");
    }

    if (method === "GET" && pathname === "/doctor") {
      const sessionResult = doctorAuthService.resolveSession(req);
      if (!sessionResult.ok) {
        if (sessionResult.reason === "expired") {
          await storeRepository.persist();
        }
        const nextPath = `${pathname}${requestUrl.search || ""}`;
        return sendRedirect(res, `/doctor-login?next=${encodeURIComponent(nextPath)}`);
      }
      const html = await readFile(webDoctorPath, "utf8");
      return sendText(res, 200, html, "text/html");
    }

    if (method === "GET" && pathname === "/app.js") {
      const js = await readFile(webAppPath, "utf8");
      return sendText(res, 200, js, "text/javascript");
    }

    if (method === "GET" && pathname === "/doctor.js") {
      const js = await readFile(webDoctorAppPath, "utf8");
      return sendText(res, 200, js, "text/javascript");
    }

    if (method === "GET" && pathname === "/doctor-login.js") {
      const js = await readFile(webDoctorLoginAppPath, "utf8");
      return sendText(res, 200, js, "text/javascript");
    }

    if (method === "GET" && pathname === "/styles.css") {
      const css = await readFile(webStylePath, "utf8");
      return sendText(res, 200, css, "text/css");
    }

    if (method === "GET" && pathname === "/manifest.webmanifest") {
      const manifest = await readFile(webManifestPath, "utf8");
      return sendText(res, 200, manifest, "application/manifest+json");
    }

    if (method === "GET" && pathname === "/sw.js") {
      const sw = await readFile(webSwPath, "utf8");
      return sendText(res, 200, sw, "text/javascript");
    }

    if (method === "GET" && pathname === "/offline.html") {
      const offline = await readFile(webOfflinePath, "utf8");
      return sendText(res, 200, offline, "text/html");
    }

    if (method === "GET" && pathname === "/privacy") {
      const html = await readFile(webPrivacyPath, "utf8");
      return sendText(res, 200, html, "text/html");
    }

    if (method === "GET" && pathname === "/terms") {
      const html = await readFile(webTermsPath, "utf8");
      return sendText(res, 200, html, "text/html");
    }

    if (method === "GET" && pathname.startsWith("/uploads/")) {
      const filename = pathname.replace("/uploads/", "");
      if (!filename || filename.includes("/") || filename.includes("\\")) {
        return sendJson(res, 400, { error: "invalid_upload_path" });
      }
      const absPath = path.join(uploadDirPath, filename);
      const ext = path.extname(filename).toLowerCase();
      const mimeMap = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif"
      };
      const mimeType = mimeMap[ext];
      if (!mimeType) return sendJson(res, 404, { error: "upload_not_found" });
      try {
        const bin = await readFile(absPath);
        return sendBinary(res, 200, bin, mimeType);
      } catch (_) {
        return sendJson(res, 404, { error: "upload_not_found" });
      }
    }

    if (method === "POST" && pathname === "/api/v1/logs/daily") {
      const bodyRaw = await parseJsonBody(req);
      const body = normalizeDailyLogInput(bodyRaw);
      if (!requireConsentForWrite(body.user_id, res)) return;
      const validationError = validateLogInput(body);
      if (validationError) {
        return sendJson(res, 400, { error: validationError });
      }
      const {
        log_id: logId,
        image_clear: imageClear,
        image_keep: imageKeep,
        image_data_url: imageDataUrl,
        image_name: imageName,
        ...bodyWithoutImage
      } = body;
      const nowIso = new Date().toISOString();

      if (logId) {
        const current = storeRepository.findLogById(logId);
        if (!current || current.user_id !== body.user_id) {
          return sendJson(res, 404, { error: "log_not_found" });
        }
        let image = current.image || null;
        if (imageDataUrl) {
          image = await storeImageFromDataUrl(imageDataUrl, imageName || "");
        } else if (imageClear) {
          image = null;
        } else if (!imageKeep) {
          image = current.image || null;
        }
        const updated = {
          ...current,
          ...bodyWithoutImage,
          image,
          updated_at: nowIso
        };
        storeRepository.replaceLogById(logId, updated);
        await storeRepository.persist();
        return sendJson(res, 200, {
          log_id: updated.log_id,
          status: "updated",
          image: updated.image || null,
          updated_at: updated.updated_at
        });
      }

      let image = null;
      if (imageDataUrl) {
        image = await storeImageFromDataUrl(imageDataUrl, imageName || "");
      }
      const log = {
        ...bodyWithoutImage,
        image,
        log_id: `log_${randomUUID()}`,
        created_at: nowIso
      };
      storeRepository.addLog(log);
      await storeRepository.persist();
      return sendJson(res, 200, { log_id: log.log_id, status: "accepted", image: log.image || null });
    }

    if (method === "GET" && pathname === "/api/v1/logs/recent") {
      const userId = requestUrl.searchParams.get("user_id");
      const limit = Number(requestUrl.searchParams.get("limit") || "5");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const userLogs = getUserLogs(userId).slice(-Math.max(1, Math.min(limit, 30))).reverse();
      return sendJson(res, 200, { items: userLogs });
    }

    if (method === "GET" && pathname === "/api/v1/logs/by-date") {
      const userId = requestUrl.searchParams.get("user_id");
      const date = requestUrl.searchParams.get("date");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      if (!date) return sendJson(res, 400, { error: "missing date" });
      const normalizedDate = String(date || "").slice(0, 10);
      const matched = getUserLogs(userId).filter((log) => recordedAtDateKey(log.recorded_at) === normalizedDate);
      const item = matched.length ? matched[matched.length - 1] : null;
      return sendJson(res, 200, { item });
    }

    if (method === "GET" && pathname === "/api/v1/logs/range") {
      const userId = requestUrl.searchParams.get("user_id");
      const from = requestUrl.searchParams.get("from");
      const to = requestUrl.searchParams.get("to");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      if (!from || !to) return sendJson(res, 400, { error: "missing from/to" });
      const items = getUserLogs(userId).filter((log) => {
        const date = recordedAtDateKey(log.recorded_at);
        return date >= from && date <= to;
      });
      return sendJson(res, 200, { from, to, items });
    }

    if (method === "GET" && pathname === "/api/v1/logs/calendar") {
      const userId = requestUrl.searchParams.get("user_id");
      const month = requestUrl.searchParams.get("month");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      if (!month) return sendJson(res, 400, { error: "missing month" });
      const userLogs = getUserLogs(userId);
      const items = buildCalendarItems(userLogs, month);
      return sendJson(res, 200, { month, items });
    }

    if (method === "GET" && pathname === "/api/v1/logs/stats") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const userLogs = getUserLogs(userId);
      return sendJson(res, 200, getStats(userLogs));
    }

    if (method === "GET" && pathname === "/api/v1/insights/daily-summary") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const userLogs = getUserLogs(userId);
      const last = userLogs[userLogs.length - 1];
      if (!last) return sendJson(res, 404, { error: "no logs found" });

      const praise = buildPraiseMessage(last);
      const summaryText = `睡眠${last.sleep_hours}時間、症状スコア${last.symptom_score}、気分スコア${last.mood_score}の記録です。${
        praise ? ` ${praise}` : ""
      }`;
      const payload = insightEnvelope(
        { summary: summaryText, praise },
        ["sleep_hours", "symptom_score", "mood_score", "note"],
        userLogs.length
      );
      storeRepository.addInsight({ ...payload, user_id: userId, type: "daily_summary", created_at: new Date().toISOString() });
      await storeRepository.persist();
      return sendJson(res, 200, payload);
    }

    if (method === "GET" && pathname === "/api/v1/insights/trend") {
      const userId = requestUrl.searchParams.get("user_id");
      const windowDays = Number(requestUrl.searchParams.get("window_days") || "7");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const userLogs = getUserLogs(userId);
      if (!userLogs.length) return sendJson(res, 404, { error: "no logs found" });

      const targetLogs = userLogs.slice(-windowDays);
      const moodAvg = average(targetLogs.map((l) => l.mood_score));
      const symptomAvg = average(targetLogs.map((l) => l.symptom_score));
      const trend = computeTrend(targetLogs);

      const payload = insightEnvelope(
        {
          trend,
          highlights: [
            `直近${targetLogs.length}件の平均症状スコア: ${symptomAvg.toFixed(1)}`,
            `直近${targetLogs.length}件の平均気分スコア: ${moodAvg.toFixed(1)}`
          ]
        },
        ["symptom_score", "mood_score", "sleep_hours"],
        userLogs.length
      );
      storeRepository.addInsight({ ...payload, user_id: userId, type: "trend", created_at: new Date().toISOString() });
      await storeRepository.persist();
      return sendJson(res, 200, payload);
    }

    if (method === "GET" && pathname === "/api/v1/match/providers") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const userLogs = getUserLogs(userId);
      if (!userLogs.length) return sendJson(res, 404, { error: "no logs found" });
      const userLocation = parseUserLocation(requestUrl.searchParams);
      const { category, providers: matched } = providerMatchingService.matchProviders(userLogs[userLogs.length - 1], {
        minFit: 0.5,
        limit: providers.length,
        userLocation
      });

      const payload = insightEnvelope(
        {
          category: category.id,
          recommended_departments: category.recommended_departments,
          location_used: Boolean(userLocation),
          providers: matched
        },
        ["symptoms", "symptom_score", "mood_score", "sleep_quality_score"],
        userLogs.length
      );
      storeRepository.addInsight({
        ...payload,
        user_id: userId,
        type: "provider_match",
        created_at: new Date().toISOString()
      });
      await storeRepository.persist();
      return sendJson(res, 200, payload);
    }

    if (method === "GET" && pathname === "/api/v1/insights/next-step") {
      const userId = requestUrl.searchParams.get("user_id");
      if (!userId) return sendJson(res, 400, { error: "missing user_id" });
      const userLogs = getUserLogs(userId);
      if (!userLogs.length) return sendJson(res, 404, { error: "no logs found" });
      const targetLogs = userLogs.slice(-7);
      const trend = computeTrend(targetLogs);
      const last = userLogs[userLogs.length - 1];

      const payload = insightEnvelope(
        {
          step: makeNextStep(last, trend),
          trend
        },
        ["symptom_score", "mood_score", "sleep_hours"],
        userLogs.length
      );
      storeRepository.addInsight({ ...payload, user_id: userId, type: "next_step", created_at: new Date().toISOString() });
      await storeRepository.persist();
      return sendJson(res, 200, payload);
    }

    if (method === "POST" && pathname === "/api/v1/safety/evaluate") {
      const body = await parseJsonBody(req);
      if (!body.user_id || !body.text) {
        return sendJson(res, 400, { error: "user_id and text are required" });
      }
      if (!requireConsentForWrite(String(body.user_id || "").trim(), res)) return;
      const result = safetyService.evaluateSafety(body.text);
      storeRepository.addSafetyEvent({
        event_id: `sev_${randomUUID()}`,
        user_id: body.user_id,
        raw_input: body.text,
        risk_level: result.risk_level,
        triggered_rules: result.triggered_rules,
        normal_response_blocked: result.block_normal_response,
        created_at: new Date().toISOString()
      });
      await storeRepository.persist();
      return sendJson(res, 200, result);
    }

    if (method === "POST" && pathname === "/api/v1/voice/transcribe") {
      const body = await parseJsonBody(req);
      const userId = String(body.user_id || "").trim();
      if (!userId) {
        return sendJson(res, 400, { error: "missing user_id" });
      }
      if (!requireConsentForWrite(userId, res)) return;
      if (!body.audio_base64) {
        return sendJson(res, 400, { error: "audio_base64 is required" });
      }
      if (!OPENAI_API_KEY) {
        return sendJson(res, 501, {
          error: "voice_transcribe_not_configured",
          message: "Set OPENAI_API_KEY to enable cross-browser transcription fallback."
        });
      }
      const text = await transcribeAudioWithOpenAI(body.audio_base64, body.mime_type);
      return sendJson(res, 200, { text });
    }

    return sendJson(res, 404, { error: "not found" });
  } catch (error) {
    const statusCode = Number(error.statusCode || 500);
    if (statusCode >= 400 && statusCode < 500) {
      return sendJson(res, statusCode, { error: String(error.message || "bad_request") });
    }
    return sendJson(res, 500, { error: "internal_error", message: String(error.message || error) });
  }
});

server.on("error", (error) => {
  // eslint-disable-next-line no-console
  if (error && error.code === "EADDRINUSE") {
    console.error(
      `Server start failed: port ${PORT} is already in use. Stop the existing process or run with another port (example: PORT=8788 npm start).`
    );
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  if (error && error.code === "EACCES") {
    console.error(
      `Server start failed: permission denied for ${HOST}:${PORT}. Try a port >=1024 or run with PORT=8788 npm start.`
    );
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  if (error && error.code === "EPERM") {
    console.error(
      `Server start failed: operation not permitted for ${HOST}:${PORT}. Try HOST=127.0.0.1 PORT=8788 npm start.`
    );
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.error("Server start failed:", error);
  process.exit(1);
});

bootstrapConfig()
  .then(() => {
    server.listen(PORT, HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`health-ai-core listening on http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to load config:", error);
    process.exit(1);
  });
