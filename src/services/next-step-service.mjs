export function makeNextStep(lastLog, trend) {
  const steps = [];

  if (lastLog.sleep_hours < 6) {
    steps.push("今夜は就寝時刻を30分だけ早めて、睡眠時間の確保を優先しましょう。");
  }
  if (lastLog.symptom_score >= 7) {
    steps.push("症状が強めなので、無理を減らして休息を優先してください。");
  }
  if (lastLog.mood_score <= 3) {
    steps.push("気分の落ち込みが続く場合は、早めの受診相談を検討しましょう。");
  }
  if (trend === "worsening") {
    steps.push("悪化傾向があるため、2-3日以内に医療機関へ相談する選択肢が安全です。");
  }
  if (steps.length === 0) {
    steps.push("今の記録ペースを維持しつつ、水分・食事・睡眠のリズムを整えましょう。");
  }

  return steps[0];
}
