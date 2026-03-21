function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function clampHistoryItems(items, limit = 12) {
  return items.slice(Math.max(0, items.length - limit));
}

function normalizeHistory(history) {
  if (history === undefined || history === null) return [];
  if (!Array.isArray(history)) throw badRequest("history must be array");

  return clampHistoryItems(history)
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const role = String(item.role || item.sender || "user").trim().toLowerCase();
      const text = String(item.text ?? item.content ?? item.message ?? "").trim();
      if (!text) return null;
      return {
        role: role === "assistant" ? "assistant" : "user",
        text: text.slice(0, 1000)
      };
    })
    .filter(Boolean);
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function truncate(text, maxLength = 120) {
  const value = String(text || "").trim().replace(/\s+/g, " ");
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function summarizeTimeline(latestLog, trend) {
  if (!latestLog) return "記録履歴はまだ少なく、今回の相談文が中心です。";
  const date = String(latestLog.recorded_at || "").slice(0, 10) || "直近";
  const symptoms = Array.isArray(latestLog.symptoms) && latestLog.symptoms.length ? latestLog.symptoms.join("・") : "症状記録あり";
  const symptomScore = Number.isFinite(Number(latestLog.symptom_score)) ? `つらさ${latestLog.symptom_score}` : null;
  const moodScore = Number.isFinite(Number(latestLog.mood_score)) ? `気分${latestLog.mood_score}` : null;
  const parts = [date, symptoms, symptomScore, moodScore].filter(Boolean);
  if (trend && trend !== "unknown") {
    parts.push(`全体傾向は${trend}`);
  }
  return parts.join(" / ");
}

function detectSymptomsFromText({ categories, text }) {
  const detected = [];

  for (const category of categories) {
    for (const signal of Array.isArray(category.signals) ? category.signals : []) {
      if (text.includes(signal)) detected.push(signal);
    }
  }

  return unique(detected).slice(0, 6);
}

function detectSymptoms({ categories, combinedText, latestLog }) {
  const detected = detectSymptomsFromText({ categories, text: combinedText });
  if (detected.length) return detected;

  for (const symptom of Array.isArray(latestLog?.symptoms) ? latestLog.symptoms : []) {
    detected.push(String(symptom || "").trim());
  }

  return unique(detected).slice(0, 6);
}

function summarizeConcern(text, symptomCandidates) {
  if (symptomCandidates.length) {
    return `${symptomCandidates.join("・")}について相談。自由記述: ${truncate(text, 90)}`;
  }
  return truncate(text, 110);
}

function mapUrgency(safetyResult) {
  const risk = String(safetyResult?.risk_level || "low");
  if (risk === "high") {
    return {
      level: "high",
      message: String(safetyResult?.emergency_guidance || "強い症状がある場合は、すぐに医療機関へ相談してください。"),
      recommended_action: "救急相談や早急な受診を優先してください",
      should_seek_immediate_care: true
    };
  }
  if (risk === "medium") {
    return {
      level: "medium",
      message: "症状が続く、または強まる場合は本日中から早めの相談を検討してください。",
      recommended_action: "かかりつけ医または該当診療科への早めの相談",
      should_seek_immediate_care: false
    };
  }
  return {
    level: "low",
    message: "現時点では記録を続けながら様子整理がしやすい段階です。悪化時は早めに相談してください。",
    recommended_action: "症状の経過を記録し、必要時に受診相談",
    should_seek_immediate_care: false
  };
}

function buildDepartmentReason(category, departmentName, symptomCandidates, providerCandidates) {
  const reasons = [];
  if (symptomCandidates.length) reasons.push(`${symptomCandidates.join("・")}が相談内容に含まれています`);
  if (category?.recommended_departments?.length) {
    reasons.push(`${category.recommended_departments.join(" / ")}が候補カテゴリです`);
  }
  if (providerCandidates.length) {
    reasons.push(`近い候補として${providerCandidates[0].name}などがあります`);
  }
  if (!reasons.length) {
    reasons.push(`${departmentName}やかかりつけ医で整理相談しやすい内容です`);
  }
  return reasons.join("。");
}

function buildReply({
  text,
  symptomCandidates,
  urgencyHint,
  suggestedDepartment,
  latestLog,
  trend,
  disclaimer
}) {
  const concern = symptomCandidates.length
    ? `${symptomCandidates.join("・")}が気になっている状況として受け取りました。`
    : `${truncate(text, 70)}という相談内容として受け取りました。`;

  const context = latestLog
    ? `直近の記録では ${summarizeTimeline(latestLog, trend)} でした。`
    : "まだ十分な記録がないため、今回の相談文を中心に整理しています。";

  if (urgencyHint.level === "high") {
    return [
      "話してくださってありがとうございます。",
      concern,
      "ここでは診断ではなく整理と安全寄りの案内を行います。",
      urgencyHint.message,
      disclaimer
    ].join(" ");
  }

  if (urgencyHint.level === "medium") {
    return [
      "相談してくださってありがとうございます。",
      concern,
      context,
      `${suggestedDepartment.name}やかかりつけ医に早めに相談できると安心です。`,
      "症状の強さ、始まった時期、生活への影響を一緒に記録しておくと共有しやすくなります。",
      disclaimer
    ].join(" ");
  }

  return [
    "相談してくださってありがとうございます。",
    concern,
    context,
    `${suggestedDepartment.name}やかかりつけ医で相談先を整理しやすい内容です。`,
    "つらさの強さ、時間帯、続いている日数があれば、次の共有に役立ちます。",
    disclaimer
  ].join(" ");
}

export function createHealthChatService({
  symptomConfig,
  getUserLogs,
  getProfile,
  calcAge = () => null,
  evaluateSafety,
  computeTrend,
  matchProviders,
  defaultDisclaimer,
  now = () => new Date()
}) {
  function respond(input) {
    const userId = String(input?.user_id || "").trim();
    const text = String(input?.text || "").trim();
    if (!userId) throw badRequest("missing user_id");
    if (!text) throw badRequest("missing text");

    const history = normalizeHistory(input?.history);
    const recentLogs = getUserLogs(userId).slice(-7);
    const latestLog = recentLogs[recentLogs.length - 1] || null;
    const profile = getProfile(userId) || {};

    const recentUserTurns = history.filter((item) => item.role === "user").map((item) => item.text).slice(-3);
    const combinedText = [text, ...recentUserTurns].join(" ").trim();
    const symptomCandidates = detectSymptoms({
      categories: Array.isArray(symptomConfig?.categories) ? symptomConfig.categories : [],
      combinedText,
      latestLog
    });

    const chatContextLog = {
      symptoms: symptomCandidates,
      note: combinedText || text,
      symptom_score: latestLog?.symptom_score ?? null,
      mood_score: latestLog?.mood_score ?? null
    };

    const providerResult = matchProviders(chatContextLog, { minFit: 0.5, limit: 3 });
    const category = providerResult?.category || null;
    const providerCandidates = Array.isArray(providerResult?.providers) ? providerResult.providers : [];
    const departments = Array.isArray(category?.recommended_departments) ? category.recommended_departments : [];
    const suggestedDepartmentName = departments[0] || "内科";
    const trend = recentLogs.length ? computeTrend(recentLogs) : "unknown";
    const safetyResult = evaluateSafety(combinedText || text);
    const urgencyHint = mapUrgency(safetyResult);
    const concernSummary = summarizeConcern(text, symptomCandidates);

    const suggestedDepartment = {
      name: suggestedDepartmentName,
      reason: buildDepartmentReason(category, suggestedDepartmentName, symptomCandidates, providerCandidates),
      alternatives: departments.slice(1, 3)
    };

    const structuredSummary = {
      format_version: "health_chat_summary_v1",
      chief_concern: concernSummary,
      symptom_candidates: symptomCandidates,
      patient_message_summary: truncate(text, 160),
      conversation_focus: recentUserTurns.length ? truncate(recentUserTurns.join(" / "), 160) : null,
      recent_log_context: latestLog
        ? {
            latest_recorded_at: latestLog.recorded_at,
            latest_symptoms: Array.isArray(latestLog.symptoms) ? latestLog.symptoms : [],
            symptom_score: latestLog.symptom_score ?? null,
            mood_score: latestLog.mood_score ?? null,
            sleep_hours: latestLog.sleep_hours ?? null,
            trend_7d: trend
          }
        : null,
      profile_context: {
        display_name: profile.display_name || "",
        age: calcAge(profile.birth_date || ""),
        sex: profile.sex || ""
      },
      suggested_department: suggestedDepartmentName,
      urgency_level: urgencyHint.level,
      doctor_share_summary: [
        `主訴: ${concernSummary}`,
        symptomCandidates.length ? `症状候補: ${symptomCandidates.join("・")}` : null,
        `想定診療科: ${suggestedDepartmentName}`,
        `緊急度目安: ${urgencyHint.level}`,
        `直近文脈: ${summarizeTimeline(latestLog, trend)}`
      ]
        .filter(Boolean)
        .join(" / ")
    };

    const reply = buildReply({
      text,
      symptomCandidates,
      urgencyHint,
      suggestedDepartment,
      latestLog,
      trend,
      disclaimer: defaultDisclaimer
    });

    return {
      reply,
      structured_summary: structuredSummary,
      suggested_department: suggestedDepartment,
      urgency_hint: {
        ...urgencyHint,
        triggered_rules: Array.isArray(safetyResult?.triggered_rules) ? safetyResult.triggered_rules : []
      },
      suggested_providers: providerCandidates.map((provider) => ({
        provider_id: provider.provider_id,
        name: provider.name,
        fit_score: provider.fit_score,
        recommendation_score: provider.recommendation_score ?? provider.fit_score,
        online_available: Boolean(provider.online_available),
        next_available_at: provider.next_available_at || null
      })),
      meta: {
        generated_at: now().toISOString(),
        engine: "rule_based_health_chat_v1",
        user_id: userId,
        history_count: history.length,
        used_recent_logs: recentLogs.length > 0,
        disclaimer: defaultDisclaimer
      }
    };
  }

  return {
    respond
  };
}
