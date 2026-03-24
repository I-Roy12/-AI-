import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

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

function normalizeLoginId(loginId) {
  return String(loginId || "").trim().toLowerCase();
}

function hashPassword(password, saltHex = randomBytes(16).toString("hex")) {
  const hashHex = scryptSync(String(password || ""), saltHex, 64).toString("hex");
  return {
    salt: saltHex,
    hash: hashHex
  };
}

function verifyPassword(password, saltHex, expectedHashHex) {
  if (!saltHex || !expectedHashHex) return false;
  const actual = Buffer.from(scryptSync(String(password || ""), saltHex, 64).toString("hex"), "hex");
  const expected = Buffer.from(String(expectedHashHex || ""), "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function createPatientAuthService({
  repository,
  cookieName,
  sessionHours,
  secureCookie = false
}) {
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

  function register({ login_id, password, display_name, user_id }) {
    const normalizedLoginId = normalizeLoginId(login_id);
    const normalizedUserId = String(user_id || "").trim();
    const normalizedDisplayName = String(display_name || "").trim();
    if (!normalizedLoginId) {
      const error = new Error("missing_login_id");
      error.statusCode = 400;
      throw error;
    }
    if (!normalizedUserId) {
      const error = new Error("missing_user_id");
      error.statusCode = 400;
      throw error;
    }
    if (String(password || "").length < 6) {
      const error = new Error("weak_password");
      error.statusCode = 400;
      throw error;
    }
    if (repository.findPatientAccountByLoginId(normalizedLoginId)) {
      const error = new Error("login_id_taken");
      error.statusCode = 409;
      throw error;
    }
    if (repository.findPatientAccountByUserId(normalizedUserId)) {
      const error = new Error("user_id_already_linked");
      error.statusCode = 409;
      throw error;
    }

    const passwordDigest = hashPassword(password);
    const account = {
      patient_account_id: `pac_${randomUUID()}`,
      user_id: normalizedUserId,
      login_id: normalizedLoginId,
      display_name: normalizedDisplayName || normalizedLoginId,
      password_salt: passwordDigest.salt,
      password_hash: passwordDigest.hash,
      created_at: new Date().toISOString()
    };
    repository.addPatientAccount(account);
    return account;
  }

  function authenticate(login_id, password) {
    const account = repository.findPatientAccountByLoginId(normalizeLoginId(login_id));
    if (!account) return null;
    if (!verifyPassword(password, account.password_salt, account.password_hash)) return null;
    return account;
  }

  function issueSession(account) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionHours * 60 * 60 * 1000).toISOString();
    const session = {
      session_id: `pss_${randomUUID()}`,
      patient_account_id: account.patient_account_id,
      user_id: account.user_id,
      login_id: account.login_id,
      display_name: account.display_name,
      created_at: now.toISOString(),
      expires_at: expiresAt
    };
    repository.prunePatientSessions(now.getTime());
    repository.addPatientSession(session);
    return session;
  }

  function revokeSessionById(sessionId) {
    if (!sessionId) return false;
    return repository.removePatientSessionById(sessionId);
  }

  function resolveSession(req) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[cookieName];
    if (!sessionId) {
      return { ok: false, reason: "missing", session: null, clearCookie: false };
    }
    const session = repository.findPatientSessionById(sessionId);
    if (!session) {
      return { ok: false, reason: "invalid", session: null, clearCookie: true };
    }
    const expiresAt = new Date(session.expires_at).getTime();
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      repository.removePatientSessionById(session.session_id);
      return { ok: false, reason: "expired", session: null, clearCookie: true };
    }
    return { ok: true, reason: "ok", session, clearCookie: false };
  }

  function authErrorPayload(reason) {
    if (reason === "expired") {
      return {
        status: 401,
        body: {
          error: "patient_session_expired",
          message: "患者ログインの有効期限が切れました。再ログインしてください。"
        }
      };
    }
    if (reason === "invalid") {
      return {
        status: 401,
        body: {
          error: "patient_auth_invalid_session",
          message: "患者ログイン情報が無効です。再ログインしてください。"
        }
      };
    }
    return {
      status: 401,
      body: {
        error: "patient_auth_required",
        message: "この操作には患者ログインが必要です。"
      }
    };
  }

  return {
    register,
    authenticate,
    issueSession,
    revokeSessionById,
    resolveSession,
    authErrorPayload,
    buildSessionCookie,
    buildClearedSessionCookie
  };
}
