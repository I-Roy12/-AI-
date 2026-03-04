# データモデル v0.1（最小）

## 1. users
- `user_id` (PK)
- `created_at`
- `timezone`

## 2. daily_logs
- `log_id` (PK)
- `user_id` (FK -> users)
- `recorded_at`
- `symptoms` (array<string>)
- `symptom_score` (0-10)
- `mood_score` (0-10)
- `sleep_hours` (number)
- `sleep_quality_score` (0-10)
- `medication_status` (taken / missed / none)
- `note` (text)
- `created_at`

## 3. insights
- `insight_id` (PK)
- `user_id` (FK -> users)
- `type` (daily_summary / trend / provider_match)
- `content` (json)
- `confidence` (low / medium / high)
- `evidence` (json)
- `audit_id` (FK -> audit_logs)
- `created_at`

## 4. safety_events
- `event_id` (PK)
- `user_id` (FK -> users)
- `risk_level` (low / medium / high)
- `triggered_rules` (json)
- `raw_input` (text)
- `normal_response_blocked` (bool)
- `created_at`

## 5. consents
- `consent_id` (PK)
- `user_id` (FK -> users)
- `scope` (provider_share / analytics / notifications)
- `granted` (bool)
- `granted_at`
- `revoked_at` (nullable)

## 6. providers
- `provider_id` (PK)
- `name`
- `departments` (array<string>)
- `supported_categories` (array<string>)
- `online_available` (bool)
- `description_style_tags` (array<string>)
- `next_available_at`

## 7. audit_logs
- `audit_id` (PK)
- `user_id` (FK -> users)
- `action` (summary_generate / trend_analyze / safety_check / provider_match)
- `input_refs` (json)
- `output_snapshot` (json)
- `safety_filters_applied` (json)
- `created_at`

## 8. インデックス（MVP）
- `daily_logs(user_id, recorded_at desc)`
- `insights(user_id, created_at desc)`
- `safety_events(user_id, created_at desc)`
- `providers(next_available_at)`

## 9. 設計メモ
- 医療連携前提で`audit_id`を全AI出力に付与
- 同意撤回に備え、共有処理は`consents`を毎回参照
- 生データとAI出力は分離保存し、再生成可能にする
