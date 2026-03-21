function summarizeTopSymptoms(logs) {
  const counts = new Map();

  for (const log of logs) {
    for (const symptom of Array.isArray(log.symptoms) ? log.symptoms : []) {
      counts.set(symptom, (counts.get(symptom) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function summarizeMedication(logs) {
  const result = { taken: 0, missed: 0, none: 0, unknown: 0 };

  for (const log of logs) {
    const key = String(log.medication_status || "unknown");
    if (Object.prototype.hasOwnProperty.call(result, key)) result[key] += 1;
    else result.unknown += 1;
  }

  return result;
}

function uniqueStrings(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value, maxLength = 44) {
  const text = normalizeText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function collectConversationSnippets(logs) {
  const fields = [
    "chat_text",
    "conversation_text",
    "consultation_text",
    "doctor_share_summary",
    "patient_message_summary",
    "conversation_focus",
    "note"
  ];
  const snippets = [];

  for (const log of logs) {
    for (const field of fields) {
      const text = normalizeText(log?.[field]);
      if (text) snippets.push(text);
    }
  }

  return uniqueStrings(snippets).slice(-8);
}

function splitIntoSentences(snippets) {
  const items = [];

  for (const snippet of snippets) {
    const parts = String(snippet)
      .split(/[。！？!\n]/)
      .map((part) => normalizeText(part))
      .filter(Boolean);
    items.push(...parts);
  }

  return uniqueStrings(items).slice(-18);
}

function severityLabel(score) {
  if (score >= 8) return "強い";
  if (score >= 5) return "中等度";
  if (score >= 3) return "軽度";
  return "軽微";
}

function summarizeSeverity(latest, averageScore, trend) {
  const latestScore = Number(latest?.symptom_score ?? 0);
  const avgScore = Number(averageScore ?? 0);
  const trendLabel = trend === "worsening" ? "悪化傾向" : trend === "improving" ? "改善傾向" : "横ばい";
  return `${severityLabel(latestScore)}（最新 ${latestScore}/10、直近平均 ${avgScore.toFixed(1)}/10、${trendLabel}）`;
}

function summarizeMedicationOverview(summary) {
  const taken = Number(summary?.taken || 0);
  const missed = Number(summary?.missed || 0);
  const none = Number(summary?.none || 0);
  const unknown = Number(summary?.unknown || 0);

  if (taken === 0 && missed === 0 && none === 0 && unknown > 0) {
    return "会話メモ上で明確な服薬情報なし";
  }

  return `服薬あり ${taken}回 / 飲み忘れ ${missed}回 / 服薬なし ${none}回 / 不明 ${unknown}回`;
}

function buildChiefComplaint(topSymptoms, latest, sentences) {
  const topLabel = topSymptoms.slice(0, 2).map((item) => item.symptom).join("・");
  const latestSymptoms = Array.isArray(latest?.symptoms) ? latest.symptoms.slice(0, 2).join("・") : "";
  const sentence = sentences.find((item) => item.length >= 6) || "";

  if (topLabel) return `${topLabel}中心`;
  if (latestSymptoms) return `${latestSymptoms}中心`;
  if (sentence) return truncateText(sentence, 28);
  return "会話メモから主訴の特定は限定的";
}

function inferOnset(sentences, fromDate) {
  const patterns = [
    /\d+\s*(日|週間|週|か月|ヶ月|ヵ月|年)\s*(前|くらい前|ほど前)?/,
    /(今日|昨日|今朝|今週|先週|先月|以前から|もともと|ずっと)/
  ];

  for (const sentence of sentences) {
    for (const pattern of patterns) {
      const match = sentence.match(pattern);
      if (match) return `${match[0]}からと会話上で言及`;
    }
  }

  return `少なくとも ${fromDate} 以降の記録で継続`;
}

function buildLifeImpact(sentences, latest) {
  const joined = sentences.join(" / ");
  const impacts = [];

  const rules = [
    { label: "睡眠への影響", keywords: ["眠れ", "寝れ", "不眠", "中途覚醒", "睡眠"] },
    { label: "仕事・学業・集中への影響", keywords: ["仕事", "勤務", "学校", "授業", "勉強", "集中"] },
    { label: "家事・外出への影響", keywords: ["家事", "外出", "買い物", "歩く", "動け", "起き上が"] },
    { label: "食事への影響", keywords: ["食欲", "食事", "食べ", "吐き気"] },
    { label: "気分・不安による負担", keywords: ["不安", "落ち込み", "気分", "しんどい", "つらい"] }
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => joined.includes(keyword))) {
      impacts.push(rule.label);
    }
  }

  if (!impacts.length && Number(latest?.sleep_hours || 0) < 6) impacts.push("睡眠への影響");
  if (!impacts.length && Number(latest?.symptom_score || 0) >= 7) impacts.push("日中活動への影響");
  if (!impacts.length && Number(latest?.mood_score || 0) <= 3) impacts.push("気分面の負担");

  return impacts.length ? impacts.slice(0, 3) : ["会話メモ上で明確な生活影響の記載は限定的"];
}

function buildPatientConcerns(sentences, latest) {
  const keywords = ["困", "不安", "心配", "つら", "しんど", "相談", "気になる", "受診", "治ら", "続いて"];
  const concerns = sentences.filter((sentence) => keywords.some((keyword) => sentence.includes(keyword)));

  if (concerns.length) {
    return concerns.slice(0, 3).map((sentence) => truncateText(sentence, 46));
  }

  const latestNote = normalizeText(latest?.note);
  if (latestNote) return [truncateText(latestNote, 46)];
  return ["困りごとの明確な記載は限定的"];
}

function buildClinicianBullets({
  chiefComplaint,
  onset,
  severity,
  lifeImpact,
  patientConcerns,
  departments
}) {
  const bullets = [
    `主訴は ${chiefComplaint}`,
    `症状開始は ${onset}`,
    `強さは ${severity}`,
    `生活影響は ${lifeImpact.join(" / ")}`
  ];

  if (patientConcerns.length) bullets.push(`本人の困りごと: ${patientConcerns[0]}`);
  if (departments.length) bullets.push(`AI抽出の受診科候補: ${departments.join(" / ")}`);

  return bullets.slice(0, 6);
}

export function createDoctorSummaryService({
  getUserLogs,
  getProfile,
  evaluateSafety,
  computeTrend,
  makeNextStep,
  matchProviders,
  average,
  calcAge,
  defaultDisclaimer,
  now = () => new Date()
}) {
  function buildDoctorSummary(userId, windowDays = 14) {
    const userLogs = getUserLogs(userId);
    if (!userLogs.length) {
      const err = new Error("no logs found");
      err.statusCode = 404;
      throw err;
    }

    const days = Math.max(7, Math.min(90, Number(windowDays) || 14));
    const targetLogs = userLogs.slice(-days);
    const latest = targetLogs[targetLogs.length - 1];
    const profile = getProfile(userId) || {};

    const symptomAvg = average(targetLogs.map((log) => log.symptom_score));
    const moodAvg = average(targetLogs.map((log) => log.mood_score));
    const sleepHoursAvg = average(targetLogs.map((log) => log.sleep_hours));
    const sleepQualityAvg = average(targetLogs.map((log) => log.sleep_quality_score));

    const trend = computeTrend(targetLogs);
    const nextStep = makeNextStep(latest, trend);
    const topSymptoms = summarizeTopSymptoms(targetLogs);
    const medicationSummary = summarizeMedication(targetLogs);
    const riskLevel = evaluateSafety(`${(latest.symptoms || []).join(" ")} ${latest.note || ""}`).risk_level;
    const latestDate = String(latest.recorded_at).slice(0, 10);
    const fromDate = String(targetLogs[0].recorded_at).slice(0, 10);
    const notes = targetLogs.map((log) => String(log.note || "").trim()).filter(Boolean).slice(-5);

    const bmi =
      profile.height_cm && profile.weight_kg
        ? Number((Number(profile.weight_kg) / (Number(profile.height_cm) / 100) ** 2).toFixed(1))
        : null;

    const providerMatch = matchProviders(latest, { minFit: 0.5, limit: 3 });
    const matchedProviders = providerMatch.providers;
    const recommendedDepartments = Array.isArray(providerMatch?.category?.recommended_departments)
      ? providerMatch.category.recommended_departments
      : [];

    const timelineScores = targetLogs.map((log) => ({
      date: String(log.recorded_at).slice(0, 10),
      symptom_score: Number(log.symptom_score ?? 0),
      mood_score: Number(log.mood_score ?? 0),
      sleep_quality_score: Number(log.sleep_quality_score ?? 0)
    }));

    const imageEvidence = targetLogs
      .filter((log) => log.image && log.image.url)
      .slice(-6)
      .map((log) => ({
        date: String(log.recorded_at).slice(0, 10),
        url: log.image.url,
        file_name: log.image.file_name || "",
        note: String(log.note || "").slice(0, 120)
      }));

    const conversationSnippets = collectConversationSnippets(targetLogs);
    const conversationSentences = splitIntoSentences(conversationSnippets);
    const chiefComplaint = buildChiefComplaint(topSymptoms, latest, conversationSentences);
    const onset = inferOnset(conversationSentences, fromDate);
    const severity = summarizeSeverity(latest, symptomAvg, trend);
    const lifeImpact = buildLifeImpact(conversationSentences, latest);
    const medicationOverview = summarizeMedicationOverview(medicationSummary);
    const patientConcerns = buildPatientConcerns(conversationSentences, latest);
    const clinicianBullets = buildClinicianBullets({
      chiefComplaint,
      onset,
      severity,
      lifeImpact,
      patientConcerns,
      departments: recommendedDepartments
    });

    return {
      format_version: "doctor_summary_v1",
      generated_at: now().toISOString(),
      patient: {
        user_id: userId,
        display_name: profile.display_name || "",
        age: calcAge(profile.birth_date || ""),
        sex: profile.sex || "",
        height_cm: profile.height_cm ?? null,
        weight_kg: profile.weight_kg ?? null,
        chronic_conditions: profile.chronic_conditions || "",
        bmi
      },
      period: {
        from: fromDate,
        to: latestDate,
        records: targetLogs.length
      },
      triage: {
        risk_level: riskLevel,
        trend,
        urgent_flags: riskLevel === "high" ? ["緊急キーワード検知の可能性"] : [],
        recommendation: nextStep
      },
      metrics: {
        symptom_score_avg: Number(symptomAvg.toFixed(1)),
        mood_score_avg: Number(moodAvg.toFixed(1)),
        sleep_hours_avg: Number(sleepHoursAvg.toFixed(1)),
        sleep_quality_score_avg: Number(sleepQualityAvg.toFixed(1))
      },
      latest_record: {
        recorded_at: latest.recorded_at,
        symptoms: latest.symptoms || [],
        symptom_score: latest.symptom_score,
        mood_score: latest.mood_score,
        sleep_hours: latest.sleep_hours,
        sleep_quality_score: latest.sleep_quality_score,
        medication_status: latest.medication_status,
        note: latest.note || ""
      },
      top_symptoms: topSymptoms,
      medication_summary: medicationSummary,
      consultation_summary: {
        source_count: conversationSnippets.length,
        chief_complaint: chiefComplaint,
        onset,
        severity,
        life_impact: lifeImpact,
        medication_overview: medicationOverview,
        patient_concerns: patientConcerns,
        suggested_departments: recommendedDepartments,
        clinician_bullets: clinicianBullets
      },
      timeline_scores: timelineScores,
      image_evidence: imageEvidence,
      note_digest: notes,
      provider_suggestions: matchedProviders.map((provider) => ({
        provider_id: provider.provider_id,
        name: provider.name,
        fit_score: provider.fit_score,
        online_available: provider.online_available,
        next_available_at: provider.next_available_at
      })),
      disclaimer: defaultDisclaimer
    };
  }

  return {
    buildDoctorSummary
  };
}
