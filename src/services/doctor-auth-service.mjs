import { randomUUID } from "node:crypto";

function parseCookies(rawCookieHeader) {
  const raw = String(rawCookieHeader || "");
  const out = {};
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("=") || "");
  }
  return out;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getRequestIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (forwarded) return forwarded;
  return String(req.socket?.remoteAddress || "unknown");
}

export function createDoctorAuthService({
  repository,
  cookieName,
  sessionHours,
  demoEmail,
  demoPassword,
  maxAttempts = 5,
  windowMs = 10 * 60 * 1000,
  lockMs = 15 * 60 * 1000,
  secureCookie = false
}) {
  const attempts = new Map();

  function buildCookie(name, value, maxAgeSeconds) {
    const attrs = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", "SameSite=Lax"];
    if (maxAgeSeconds !== null && maxAgeSeconds !== undefined) {
      const seconds = Math.max(0, Math.floor(maxAgeSeconds));
      attrs.push(`Max-Age=${seconds}`);
      attrs.push(`Expires=${new Date(Date.now() + seconds * 1000).toUTCString()}`);
    }
    if (secureCookie) attrs.push("Secure");
    return attrs.join("; ");
  }

  function buildSessionCookie(sessionId) {
    return buildCookie(cookieName, sessionId, sessionHours * 60 * 60);
  }

  function buildClearedSessionCookie() {
    return buildCookie(cookieName, "", 0);
  }

  function getDoctorUserByEmail(email) {
    if (normalizeEmail(email) !== normalizeEmail(demoEmail)) return null;
    return {
      doctor_id: "doc_demo_001",
      email: demoEmail,
      display_name: "デモ担当医"
    };
  }

  function rateKey(req, email) {
    const mail = normalizeEmail(email) || "unknown";
    return `${mail}|${getRequestIp(req)}`;
  }

  function getAttemptState(req, email) {
    const key = rateKey(req, email);
    const now = Date.now();
    const current = attempts.get(key);
    if (!current) {
      const seed = { count: 0, firstAt: now, blockedUntil: 0 };
      attempts.set(key, seed);
      return seed;
    }
    if (current.blockedUntil > now) return current;
    if (now - current.firstAt > windowMs) {
      current.count = 0;
      current.firstAt = now;
      current.blockedUntil = 0;
    }
    return current;
  }

  function checkRateLimit(req, email) {
    const state = getAttemptState(req, email);
    const now = Date.now();
    if (state.blockedUntil > now) {
      return {
        limited: true,
        retry_after_seconds: Math.max(1, Math.ceil((state.blockedUntil - now) / 1000)),
        remaining: 0
      };
    }
    return {
      limited: false,
      retry_after_seconds: 0,
      remaining: Math.max(0, maxAttempts - state.count)
    };
  }

  function recordLoginFailure(req, email) {
    const state = getAttemptState(req, email);
    const now = Date.now();
    state.count += 1;
    if (state.count >= maxAttempts) {
      state.blockedUntil = now + lockMs;
    }
    return {
      attempts: state.count,
      blocked: state.blockedUntil > now,
      retry_after_seconds: state.blockedUntil > now ? Math.max(1, Math.ceil((state.blockedUntil - now) / 1000)) : 0
    };
  }

  function recordLoginSuccess(req, email) {
    attempts.delete(rateKey(req, email));
  }

  function authenticate(email, password) {
    const doctor = getDoctorUserByEmail(email);
    if (!doctor) return null;
    if (String(password || "") !== String(demoPassword || "")) return null;
    return doctor;
  }

  function issueSession(doctor) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionHours * 60 * 60 * 1000).toISOString();
    const session = {
      session_id: `dss_${randomUUID()}`,
      doctor_id: doctor.doctor_id,
      email: doctor.email,
      display_name: doctor.display_name,
      created_at: now.toISOString(),
      expires_at: expiresAt
    };
    repository.pruneDoctorSessions(now.getTime());
    repository.addDoctorSession(session);
    return session;
  }

  function revokeSessionById(sessionId) {
    if (!sessionId) return false;
    return repository.removeDoctorSessionById(sessionId);
  }

  function resolveSession(req) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[cookieName];
    if (!sessionId) {
      return { ok: false, reason: "missing", session: null, clearCookie: false };
    }
    const session = repository.findDoctorSessionById(sessionId);
    if (!session) {
      return { ok: false, reason: "invalid", session: null, clearCookie: true };
    }
    const expiresAt = new Date(session.expires_at).getTime();
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      repository.removeDoctorSessionById(session.session_id);
      return { ok: false, reason: "expired", session: null, clearCookie: true };
    }
    return { ok: true, reason: "ok", session, clearCookie: false };
  }

  function authErrorPayload(reason) {
    if (reason === "expired") {
      return {
        status: 401,
        body: {
          error: "doctor_session_expired",
          message: "セッションが期限切れです。再ログインしてください。"
        }
      };
    }
    if (reason === "invalid") {
      return {
        status: 401,
        body: {
          error: "doctor_auth_invalid_session",
          message: "認証情報が無効です。再ログインしてください。"
        }
      };
    }
    return {
      status: 401,
      body: {
        error: "doctor_auth_required",
        message: "この操作には医師ログインが必要です。"
      }
    };
  }

  return {
    authenticate,
    checkRateLimit,
    recordLoginFailure,
    recordLoginSuccess,
    issueSession,
    resolveSession,
    revokeSessionById,
    authErrorPayload,
    buildSessionCookie,
    buildClearedSessionCookie
  };
}
