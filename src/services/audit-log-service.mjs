import { randomUUID } from "node:crypto";

function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return {};
  const clean = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === null) {
      clean[key] = null;
      continue;
    }
    if (["string", "number", "boolean"].includes(typeof value)) {
      clean[key] = value;
      continue;
    }
    if (Array.isArray(value)) {
      clean[key] = value.filter((item) => ["string", "number", "boolean"].includes(typeof item)).slice(0, 10);
    }
  }
  return clean;
}

export const auditEventTypes = {
  doctorLoginSuccess: "doctor.login.success",
  doctorLoginFailure: "doctor.login.failure",
  doctorViewRead: "doctor.view.read",
  doctorCommentSaved: "doctor.comment.saved",
  doctorHandoffIssued: "doctor.handoff.issued",
  shareLinkIssued: "share.link.issued",
  shareLinkRevoked: "share.link.revoked"
};

export function createAuditLogService({ repository }) {
  function record({ eventType, actor = "system", target = "-", metadata = {} }) {
    const event = {
      event_id: `evt_${randomUUID()}`,
      event_type: eventType,
      actor,
      target,
      created_at: new Date().toISOString(),
      metadata: sanitizeMetadata(metadata)
    };
    repository.addAuditLog(event);
    return event;
  }

  return {
    record
  };
}
