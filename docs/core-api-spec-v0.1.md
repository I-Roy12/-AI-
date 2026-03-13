# Core API仕様 v0.1

## 1. 共通仕様
- Base path: `/api/v1`
- Content-Type: `application/json`
- すべてのAI関連レスポンスに以下を含める
  - `disclaimer`
  - `confidence`
  - `evidence`
  - `audit_id`

## 2. エンドポイント

## POST /logs/daily
日次の体調記録を登録する

※ 同意未登録の場合は `428 consent_required`

### request
```json
{
  "user_id": "u_123",
  "recorded_at": "2026-02-27T09:15:00+09:00",
  "symptoms": ["headache", "fatigue"],
  "symptom_score": 6,
  "mood_score": 4,
  "sleep_hours": 5.5,
  "sleep_quality_score": 3,
  "medication_status": "taken",
  "note": "午後にだるさが強い"
}
```

### response
```json
{
  "log_id": "log_001",
  "status": "accepted"
}
```

## GET /insights/daily-summary?user_id={id}&date=YYYY-MM-DD
指定日の要約を返す

### response
```json
{
  "summary": "睡眠不足と疲労感の記録が継続しています。",
  "confidence": "medium",
  "evidence": ["sleep_hours", "symptom_score", "note"],
  "disclaimer": "本提案は診断ではありません。",
  "audit_id": "aud_001"
}
```

## GET /insights/trend?user_id={id}&window_days=7
短期トレンドを返す

### response
```json
{
  "trend": "worsening",
  "highlights": [
    "睡眠時間が平均6.2hから5.3hに低下",
    "疲労スコアが上昇"
  ],
  "confidence": "medium",
  "evidence": ["sleep_hours", "symptom_score"],
  "disclaimer": "本提案は診断ではありません。",
  "audit_id": "aud_002"
}
```

## GET /match/providers?user_id={id}&lat={緯度}&lng={経度}
受診先候補を返す（症状カテゴリ + 位置情報があれば近さも加味）

### response
```json
{
  "category": "sleep_and_mood",
  "recommended_departments": ["心療内科", "精神科"],
  "location_used": true,
  "providers": [
    {
      "provider_id": "dr_001",
      "name": "山田クリニック",
      "fit_score": 0.82,
      "recommendation_score": 0.93,
      "distance_km": 1.8,
      "recommendation_reason": "心療内科が適合候補です / 現在地から近い候補です",
      "online_available": true,
      "next_slot": "2026-02-28T10:30:00+09:00"
    }
  ],
  "confidence": "medium",
  "evidence": ["symptom_score", "mood_score", "sleep_quality_score"],
  "disclaimer": "本提案は診断ではなく受診先選びの補助です。",
  "audit_id": "aud_003"
}
```

## POST /safety/evaluate
安全判定を行う

※ 同意未登録の場合は `428 consent_required`

### request
```json
{
  "user_id": "u_123",
  "text": "胸が強く痛いし、息が苦しい"
}
```

### response
```json
{
  "risk_level": "high",
  "triggered_rules": ["severe_chest_pain", "breathing_difficulty"],
  "block_normal_response": true,
  "emergency_guidance": "緊急性のある可能性があります。すぐに医療機関または緊急窓口へ連絡してください。",
  "audit_id": "aud_004"
}
```

## GET /doctor/queue?window_days=14
医師向けの優先確認キューを返す（ログイン必須）

### response
```json
{
  "generated_at": "2026-03-05T04:00:00.000Z",
  "window_days": 14,
  "total": 3,
  "counts": {
    "urgent": 1,
    "high": 1,
    "medium": 1,
    "low": 0
  },
  "items": [
    {
      "user_id": "u_123",
      "display_name": "デモユーザー",
      "risk_level": "high",
      "trend": "worsening",
      "priority_score": 86,
      "priority_tier": "urgent",
      "priority_label": "最優先",
      "priority_reasons": ["高リスク判定", "悪化傾向"],
      "last_recorded_at": "2026-03-05T08:30:00+09:00",
      "symptom_score": 8,
      "mood_score": 2,
      "doctor_url": "/doctor?token=..."
    }
  ]
}
```

## GET /consent/latest?user_id={id}
利用同意の最新状態を返す

### response
```json
{
  "required": {
    "consent_version": "consent_v1",
    "scopes": ["daily_log", "profile", "doctor_share", "safety_check", "voice_transcribe"]
  },
  "accepted": true,
  "consent": {
    "consent_id": "cns_001",
    "user_id": "u_123",
    "agreed": true,
    "consent_version": "consent_v1",
    "agreed_at": "2026-03-11T00:00:00.000Z"
  }
}
```

## POST /consent
利用同意を保存する

### request
```json
{
  "user_id": "u_123",
  "agreed": true
}
```

### response
```json
{
  "status": "saved",
  "required": {
    "consent_version": "consent_v1",
    "scopes": ["daily_log", "profile", "doctor_share", "safety_check", "voice_transcribe"]
  },
  "accepted": true
}
```

## POST /share-links/revoke-all
発行済み共有リンクを一括失効する

### request
```json
{
  "user_id": "u_123"
}
```

### response
```json
{
  "status": "ok",
  "user_id": "u_123",
  "active_found": 3,
  "revoked": 3
}
```

## 3. エラー方針
- 4xx: 入力不備
- 5xx: サーバー障害
- 428: 同意前提の保存操作で同意未登録（`consent_required`）
- 安全判定失敗時はフェイルセーフで通常応答を停止し、受診相談導線のみ返す
