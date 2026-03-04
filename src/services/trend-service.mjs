export function average(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function computeTrend(logs, { averageFn = average } = {}) {
  if (!logs.length) return "stable";
  const moodAvg = averageFn(logs.map((log) => log.mood_score));
  const symptomAvg = averageFn(logs.map((log) => log.symptom_score));

  let trend = "stable";
  if (symptomAvg >= 6 || moodAvg <= 4) trend = "worsening";
  if (symptomAvg <= 3 && moodAvg >= 7) trend = "improving";
  return trend;
}
