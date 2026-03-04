import test from "node:test";
import assert from "node:assert/strict";
import { createSafetyService } from "../src/services/safety-service.mjs";
import { computeTrend } from "../src/services/trend-service.mjs";
import { makeNextStep } from "../src/services/next-step-service.mjs";
import { createProviderMatchingService } from "../src/services/provider-matching-service.mjs";
import { createDoctorSummaryService } from "../src/services/doctor-summary-service.mjs";

const makeAuditId = () => "aud_test";

const safetyConfig = {
  emergency_guidance: "救急へ連絡",
  default_disclaimer: "これは参考情報です",
  rules: [
    { id: "r_high", keywords: ["息ができない"], risk_level: "high", block_normal_response: true },
    { id: "r_mid", keywords: ["つらい"], risk_level: "medium", block_normal_response: false }
  ]
};

test("evaluateSafety returns high", () => {
  const service = createSafetyService({ safetyConfig, makeAuditId });
  const result = service.evaluateSafety("息ができない");
  assert.equal(result.risk_level, "high");
  assert.deepEqual(result.triggered_rules, ["r_high"]);
});

test("evaluateSafety returns medium", () => {
  const service = createSafetyService({ safetyConfig, makeAuditId });
  const result = service.evaluateSafety("今日は少しつらい");
  assert.equal(result.risk_level, "medium");
  assert.deepEqual(result.triggered_rules, ["r_mid"]);
});

test("evaluateSafety returns low", () => {
  const service = createSafetyService({ safetyConfig, makeAuditId });
  const result = service.evaluateSafety("調子は普通");
  assert.equal(result.risk_level, "low");
  assert.deepEqual(result.triggered_rules, []);
});

test("computeTrend classifies improving/stable/worsening", () => {
  assert.equal(
    computeTrend([
      { symptom_score: 2, mood_score: 8 },
      { symptom_score: 3, mood_score: 7 }
    ]),
    "improving"
  );

  assert.equal(
    computeTrend([
      { symptom_score: 5, mood_score: 5 },
      { symptom_score: 4, mood_score: 6 }
    ]),
    "stable"
  );

  assert.equal(
    computeTrend([
      { symptom_score: 7, mood_score: 3 },
      { symptom_score: 6, mood_score: 4 }
    ]),
    "worsening"
  );
});

test("makeNextStep branches by condition", () => {
  const sleepFirst = makeNextStep({ sleep_hours: 5, symptom_score: 4, mood_score: 6 }, "stable");
  assert.match(sleepFirst, /就寝時刻/);

  const worseningTrend = makeNextStep({ sleep_hours: 7, symptom_score: 4, mood_score: 6 }, "worsening");
  assert.match(worseningTrend, /悪化傾向/);

  const defaultStep = makeNextStep({ sleep_hours: 7, symptom_score: 4, mood_score: 6 }, "stable");
  assert.match(defaultStep, /記録ペース/);
});

test("doctor summary keeps image_evidence compatibility", () => {
  const symptomConfig = {
    categories: [
      {
        id: "sleep_and_mood",
        signals: ["不眠"],
        recommended_departments: ["心療内科"]
      }
    ]
  };
  const providers = [
    {
      provider_id: "dr_001",
      name: "みなとメンタルクリニック",
      supported_categories: ["sleep_and_mood"],
      online_available: true,
      description_style_tags: [],
      next_available_at: "2026-02-28T10:30:00+09:00"
    }
  ];

  const providerService = createProviderMatchingService({ symptomConfig, providers });
  const safetyService = createSafetyService({ safetyConfig, makeAuditId });
  const logs = [
    {
      recorded_at: "2026-03-01T09:00:00+09:00",
      symptoms: ["不眠"],
      symptom_score: 5,
      mood_score: 5,
      sleep_hours: 6.5,
      sleep_quality_score: 5,
      medication_status: "taken",
      note: "写真あり",
      image: {
        url: "/uploads/sample.png",
        file_name: "sample.png"
      }
    }
  ];

  const service = createDoctorSummaryService({
    getUserLogs: () => logs,
    getProfile: () => ({ display_name: "Demo" }),
    evaluateSafety: safetyService.evaluateSafety,
    computeTrend,
    makeNextStep,
    matchProviders: providerService.matchProviders,
    average: (nums) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0),
    calcAge: () => null,
    defaultDisclaimer: "これは参考情報です",
    now: () => new Date("2026-03-02T00:00:00.000Z")
  });

  const summary = service.buildDoctorSummary("u_1", 14);
  assert.equal(Array.isArray(summary.image_evidence), true);
  assert.equal(summary.image_evidence.length, 1);
  assert.equal(summary.image_evidence[0].url, "/uploads/sample.png");
});
