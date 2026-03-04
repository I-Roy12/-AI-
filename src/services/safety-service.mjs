export function createSafetyService({ safetyConfig, makeAuditId }) {
  function evaluateSafety(text) {
    const body = String(text || "");
    const triggered = [];

    for (const rule of safetyConfig.rules || []) {
      if ((rule.keywords || []).some((kw) => body.includes(kw))) {
        triggered.push(rule);
      }
    }

    const highTriggered = triggered.some((rule) => rule.risk_level === "high");
    return {
      risk_level: highTriggered ? "high" : triggered.length > 0 ? "medium" : "low",
      triggered_rules: triggered.map((rule) => rule.id),
      block_normal_response: triggered.some((rule) => rule.block_normal_response),
      emergency_guidance: safetyConfig.emergency_guidance,
      audit_id: makeAuditId()
    };
  }

  return {
    evaluateSafety
  };
}
