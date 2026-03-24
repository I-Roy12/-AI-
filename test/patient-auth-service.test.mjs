import test from "node:test";
import assert from "node:assert/strict";
import { createPatientAuthService } from "../src/services/patient-auth-service.mjs";

function createRepository() {
  const accounts = [];
  const sessions = [];
  return {
    addPatientAccount(account) {
      accounts.push(account);
      return account;
    },
    findPatientAccountByLoginId(loginId) {
      return accounts.find((item) => item.login_id === loginId) || null;
    },
    findPatientAccountByUserId(userId) {
      return accounts.find((item) => item.user_id === userId) || null;
    },
    addPatientSession(session) {
      sessions.push(session);
      return session;
    },
    prunePatientSessions(nowMs = Date.now()) {
      for (let i = sessions.length - 1; i >= 0; i -= 1) {
        if (new Date(sessions[i].expires_at).getTime() <= nowMs) sessions.splice(i, 1);
      }
    },
    findPatientSessionById(sessionId) {
      return sessions.find((item) => item.session_id === sessionId) || null;
    },
    removePatientSessionById(sessionId) {
      const before = sessions.length;
      for (let i = sessions.length - 1; i >= 0; i -= 1) {
        if (sessions[i].session_id === sessionId) sessions.splice(i, 1);
      }
      return before !== sessions.length;
    }
  };
}

test("patient auth registers account and authenticates by login id", () => {
  const service = createPatientAuthService({
    repository: createRepository(),
    cookieName: "patient_session",
    sessionHours: 24,
    secureCookie: false
  });

  const account = service.register({
    login_id: "taro01",
    password: "secret12",
    display_name: "たろう",
    user_id: "u_123"
  });

  assert.equal(account.login_id, "taro01");
  assert.equal(service.authenticate("taro01", "secret12")?.user_id, "u_123");
  assert.equal(service.authenticate("taro01", "wrong"), null);
});

test("patient auth resolves valid session from cookie", () => {
  const service = createPatientAuthService({
    repository: createRepository(),
    cookieName: "patient_session",
    sessionHours: 24,
    secureCookie: false
  });

  const account = service.register({
    login_id: "hana02",
    password: "secret34",
    display_name: "はな",
    user_id: "u_456"
  });
  const session = service.issueSession(account);
  const req = {
    headers: {
      cookie: `patient_session=${session.session_id}`
    }
  };
  const result = service.resolveSession(req);

  assert.equal(result.ok, true);
  assert.equal(result.session.user_id, "u_456");
});
