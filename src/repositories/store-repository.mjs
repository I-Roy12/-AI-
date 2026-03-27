import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

function emptyStore() {
  return {
    logs: [],
    insights: [],
    safetyEvents: [],
    profiles: {},
    patientAccounts: [],
    patientSessions: [],
    consents: [],
    feedbackItems: [],
    shareLinks: [],
    shareAccessLogs: [],
    doctorNotes: [],
    doctorSessions: [],
    auditLogs: []
  };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function createStoreRepository({ dataDirPath, dataStorePath }) {
  const store = emptyStore();

  function hydrate(raw) {
    store.logs = asArray(raw.logs);
    store.insights = asArray(raw.insights);
    store.safetyEvents = asArray(raw.safetyEvents);
    store.profiles = asObject(raw.profiles);
    store.patientAccounts = asArray(raw.patientAccounts);
    store.patientSessions = asArray(raw.patientSessions);
    store.consents = asArray(raw.consents);
    store.feedbackItems = asArray(raw.feedbackItems);
    store.shareLinks = asArray(raw.shareLinks);
    store.shareAccessLogs = asArray(raw.shareAccessLogs);
    store.doctorNotes = asArray(raw.doctorNotes);
    store.doctorSessions = asArray(raw.doctorSessions);
    store.auditLogs = asArray(raw.auditLogs);
  }

  async function persist() {
    const tempPath = `${dataStorePath}.tmp`;
    await writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
    await rename(tempPath, dataStorePath);
  }

  async function init() {
    await mkdir(dataDirPath, { recursive: true });
    try {
      const raw = await readFile(dataStorePath, "utf8");
      hydrate(JSON.parse(raw));
    } catch (_) {
      hydrate(emptyStore());
      await persist();
    }
  }

  function listUserLogs(userId) {
    return store.logs
      .filter((log) => log.user_id === userId)
      .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  }

  function addLog(log) {
    store.logs.push(log);
  }

  function findLogById(logId) {
    return store.logs.find((item) => item.log_id === logId) || null;
  }

  function replaceLogById(logId, nextLog) {
    const idx = store.logs.findIndex((item) => item.log_id === logId);
    if (idx === -1) return null;
    store.logs[idx] = nextLog;
    return store.logs[idx];
  }

  function removeLogsByUser(userId) {
    store.logs = store.logs.filter((item) => item.user_id !== userId);
  }

  function getProfile(userId) {
    return store.profiles[userId] || null;
  }

  function setProfile(userId, profile) {
    store.profiles[userId] = profile;
    return store.profiles[userId];
  }

  function addPatientAccount(account) {
    store.patientAccounts.push(account);
    return account;
  }

  function findPatientAccountByLoginId(loginId) {
    return store.patientAccounts.find((item) => item.login_id === loginId) || null;
  }

  function findPatientAccountByUserId(userId) {
    return store.patientAccounts.find((item) => item.user_id === userId) || null;
  }

  function listPatientAccounts() {
    return store.patientAccounts.slice();
  }

  function addPatientSession(item) {
    store.patientSessions.push(item);
    return item;
  }

  function prunePatientSessions(nowMs = Date.now()) {
    store.patientSessions = store.patientSessions.filter((item) => {
      return new Date(item.expires_at).getTime() > nowMs;
    });
  }

  function findPatientSessionById(sessionId) {
    return store.patientSessions.find((item) => item.session_id === sessionId) || null;
  }

  function removePatientSessionById(sessionId) {
    const before = store.patientSessions.length;
    store.patientSessions = store.patientSessions.filter((item) => item.session_id !== sessionId);
    return before !== store.patientSessions.length;
  }

  function addConsent(item) {
    store.consents.push(item);
    return item;
  }

  function listConsentsByUser(userId) {
    return store.consents
      .filter((item) => item.user_id === userId)
      .sort((a, b) => new Date(a.agreed_at).getTime() - new Date(b.agreed_at).getTime());
  }

  function getLatestConsentByUser(userId) {
    for (let i = store.consents.length - 1; i >= 0; i -= 1) {
      const item = store.consents[i];
      if (item.user_id === userId) return item;
    }
    return null;
  }

  function removeConsentsByUser(userId) {
    store.consents = store.consents.filter((item) => item.user_id !== userId);
  }

  function addFeedback(item) {
    store.feedbackItems.push(item);
    return item;
  }

  function listFeedback() {
    return store.feedbackItems.slice();
  }

  function listFeedbackByUser(userId) {
    return store.feedbackItems.filter((item) => item.user_id === userId);
  }

  function removeFeedbackByUser(userId) {
    store.feedbackItems = store.feedbackItems.filter((item) => item.user_id !== userId);
  }

  function listInsightsByUser(userId) {
    return store.insights.filter((item) => item.user_id === userId);
  }

  function addInsight(item) {
    store.insights.push(item);
  }

  function removeInsightsByUser(userId) {
    store.insights = store.insights.filter((item) => item.user_id !== userId);
  }

  function listSafetyEventsByUser(userId) {
    return store.safetyEvents.filter((item) => item.user_id === userId);
  }

  function addSafetyEvent(item) {
    store.safetyEvents.push(item);
  }

  function removeSafetyEventsByUser(userId) {
    store.safetyEvents = store.safetyEvents.filter((item) => item.user_id !== userId);
  }

  function addShareLink(link) {
    store.shareLinks.push(link);
    return link;
  }

  function findShareByToken(token) {
    return store.shareLinks.find((item) => item.token === token) || null;
  }

  function findShareById(shareId) {
    return store.shareLinks.find((item) => item.share_id === shareId) || null;
  }

  function listShareLinksByUser(userId) {
    return store.shareLinks.filter((item) => item.user_id === userId);
  }

  function listShareLinks() {
    return store.shareLinks.slice();
  }

  function revokeShareLink(shareId, revokedAt) {
    const link = findShareById(shareId);
    if (!link) return null;
    if (!link.revoked_at) {
      link.revoked_at = revokedAt;
    }
    return link;
  }

  function removeShareLinksByUser(userId) {
    store.shareLinks = store.shareLinks.filter((item) => item.user_id !== userId);
  }

  function addShareAccessLog(item) {
    store.shareAccessLogs.push(item);
  }

  function listShareAccessLogsByShareId(shareId) {
    return store.shareAccessLogs.filter((item) => item.share_id === shareId);
  }

  function removeShareAccessLogsByUser(userId) {
    store.shareAccessLogs = store.shareAccessLogs.filter((item) => item.user_id !== userId);
  }

  function addDoctorNote(item) {
    store.doctorNotes.push(item);
    return item;
  }

  function listDoctorNotesByUser(userId) {
    return store.doctorNotes.filter((item) => item.user_id === userId);
  }

  function removeDoctorNotesByUser(userId) {
    store.doctorNotes = store.doctorNotes.filter((item) => item.user_id !== userId);
  }

  function pruneDoctorSessions(nowMs = Date.now()) {
    store.doctorSessions = store.doctorSessions.filter((item) => {
      return new Date(item.expires_at).getTime() > nowMs;
    });
  }

  function addDoctorSession(item) {
    store.doctorSessions.push(item);
    return item;
  }

  function findDoctorSessionById(sessionId) {
    return store.doctorSessions.find((item) => item.session_id === sessionId) || null;
  }

  function removeDoctorSessionById(sessionId) {
    const before = store.doctorSessions.length;
    store.doctorSessions = store.doctorSessions.filter((item) => item.session_id !== sessionId);
    return before !== store.doctorSessions.length;
  }

  function addAuditLog(item) {
    store.auditLogs.push(item);
    return item;
  }

  return {
    init,
    persist,
    listUserLogs,
    addLog,
    findLogById,
    replaceLogById,
    removeLogsByUser,
    getProfile,
    setProfile,
    addPatientAccount,
    findPatientAccountByLoginId,
    findPatientAccountByUserId,
    listPatientAccounts,
    addPatientSession,
    prunePatientSessions,
    findPatientSessionById,
    removePatientSessionById,
    addConsent,
    listConsentsByUser,
    getLatestConsentByUser,
    removeConsentsByUser,
    addFeedback,
    listFeedback,
    listFeedbackByUser,
    removeFeedbackByUser,
    listInsightsByUser,
    addInsight,
    removeInsightsByUser,
    listSafetyEventsByUser,
    addSafetyEvent,
    removeSafetyEventsByUser,
    addShareLink,
    findShareByToken,
    findShareById,
    listShareLinksByUser,
    listShareLinks,
    revokeShareLink,
    removeShareLinksByUser,
    addShareAccessLog,
    listShareAccessLogsByShareId,
    removeShareAccessLogsByUser,
    addDoctorNote,
    listDoctorNotesByUser,
    removeDoctorNotesByUser,
    pruneDoctorSessions,
    addDoctorSession,
    findDoctorSessionById,
    removeDoctorSessionById,
    addAuditLog
  };
}
