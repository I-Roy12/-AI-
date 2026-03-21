import test from "node:test";
import assert from "node:assert/strict";
import { createHealthChatService } from "../src/services/health-chat-service.mjs";
import { createSafetyService } from "../src/services/safety-service.mjs";
import { createProviderMatchingService } from "../src/services/provider-matching-service.mjs";
import { computeTrend } from "../src/services/trend-service.mjs";

const symptomConfig = {
  categories: [
    {
      id: "sleep_and_mood",
      signals: ["不眠", "不安感", "気分の落ち込み"],
      recommended_departments: ["心療内科", "精神科"]
    },
    {
      id: "headache_and_fatigue",
      signals: ["頭痛", "だるさ"],
      recommended_departments: ["内科", "脳神経内科"]
    }
  ]
};

const providers = [
  {
    provider_id: "dr_001",
    name: "みなとメンタルクリニック",
    supported_categories: ["sleep_and_mood"],
    online_available: true,
    next_available_at: "2026-03-25T10:00:00+09:00"
  },
  {
    provider_id: "dr_002",
    name: "さくら内科",
    supported_categories: ["headache_and_fatigue"],
    online_available: false,
    next_available_at: "2026-03-25T13:00:00+09:00"
  }
];

const safetyConfig = {
  emergency_guidance: "息苦しさや強い胸痛がある場合は、すぐに医療機関へ相談してください。",
  default_disclaimer: "これは整理と受診補助のための参考情報です。",
  rules: [
    { id: "high_1", keywords: ["息ができない"], risk_level: "high", block_normal_response: true },
    { id: "mid_1", keywords: ["つらい"], risk_level: "medium", block_normal_response: false }
  ]
};

function createService({ logs = [] } = {}) {
  const safetyService = createSafetyService({ safetyConfig, makeAuditId: () => "aud_test" });
  const providerService = createProviderMatchingService({ symptomConfig, providers });

  return createHealthChatService({
    symptomConfig,
    getUserLogs: () => logs,
    getProfile: () => ({ display_name: "テスト患者", birth_date: "1990-04-01", sex: "female" }),
    calcAge: () => 35,
    evaluateSafety: safetyService.evaluateSafety,
    computeTrend,
    matchProviders: providerService.matchProviders,
    defaultDisclaimer: safetyConfig.default_disclaimer,
    now: () => new Date("2026-03-22T09:00:00.000Z")
  });
}

test("health chat returns gentle reply and structured summary from text/history", () => {
  const service = createService({
    logs: [
      {
        recorded_at: "2026-03-20T09:00:00+09:00",
        symptoms: ["不眠"],
        symptom_score: 6,
        mood_score: 4,
        sleep_hours: 5,
        sleep_quality_score: 4
      }
    ]
  });

  const result = service.respond({
    user_id: "u_123",
    text: "ここ数日、不眠と不安感が続いています。受診した方がよいですか？",
    history: [
      { role: "assistant", text: "詳しく教えてください" },
      { role: "user", text: "夜中に何度も起きます" }
    ]
  });

  assert.match(result.reply, /相談してくださってありがとうございます/);
  assert.equal(result.structured_summary.format_version, "health_chat_summary_v1");
  assert.deepEqual(result.structured_summary.symptom_candidates.slice(0, 2), ["不眠", "不安感"]);
  assert.equal(result.suggested_department.name, "心療内科");
  assert.equal(result.urgency_hint.level, "low");
  assert.equal(result.meta.history_count, 2);
  assert.equal(result.suggested_providers[0].provider_id, "dr_001");
});

test("health chat uses safety result for high urgency guidance", () => {
  const service = createService();
  const result = service.respond({
    user_id: "u_456",
    text: "急に息ができない感じがしてつらいです",
    history: []
  });

  assert.equal(result.urgency_hint.level, "high");
  assert.equal(result.urgency_hint.should_seek_immediate_care, true);
  assert.deepEqual(result.urgency_hint.triggered_rules, ["high_1", "mid_1"]);
  assert.match(result.reply, /すぐに医療機関へ相談してください/);
});

test("health chat validates required fields", () => {
  const service = createService();
  assert.throws(() => service.respond({ user_id: "", text: "" }), /missing user_id/);
  assert.throws(() => service.respond({ user_id: "u_1", text: "test", history: "bad" }), /history must be array/);
});

test("health chat prioritizes current consultation text over old logs", () => {
  const service = createService({
    logs: [
      {
        recorded_at: "2026-03-20T09:00:00+09:00",
        symptoms: ["不安感"],
        symptom_score: 4,
        mood_score: 4,
        sleep_hours: 6,
        sleep_quality_score: 5
      }
    ]
  });

  const result = service.respond({
    user_id: "u_789",
    text: "頭痛とだるさが続いています",
    history: []
  });

  assert.deepEqual(result.structured_summary.symptom_candidates.slice(0, 2), ["頭痛", "だるさ"]);
  assert.equal(result.suggested_department.name, "内科");
});
