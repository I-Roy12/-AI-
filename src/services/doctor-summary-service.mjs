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

    const matchedProviders = matchProviders(latest, { minFit: 0.5, limit: 3 }).providers;

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
