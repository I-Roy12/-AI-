# 運用メモ v0.2（第二段）

## 目的
デモ品質から運用準備品質へ移行するため、永続層分離・医師認証強化・監査ログ整備を実施。

## 変更点サマリー
- `store.json` 直接更新を `src/repositories/store-repository.mjs` に集約
- 医師認証を `src/services/doctor-auth-service.mjs` に集約
- 監査ログを `src/services/audit-log-service.mjs` 経由で `auditLogs` に保存

## 医師認証運用
- セッションCookie: `doctor_session`（HttpOnly, SameSite=Lax, Max-Age, Expires）
- 失効時レスポンス: `401 doctor_session_expired`
- 不正セッション: `401 doctor_auth_invalid_session`
- ログイン試行制限: 既定で 10分/5回失敗、超過時 `429 too_many_login_attempts`

## 監査ログ運用
- 保存先: `data/store.json` の `auditLogs`
- 必須項目:
  - `event_id`
  - `event_type`
  - `actor`
  - `target`
  - `created_at`
  - `metadata`
- 主要イベント:
  - `doctor.login.success`
  - `doctor.login.failure`
  - `doctor.view.read`
  - `doctor.comment.saved`
  - `share.link.issued`
  - `share.link.revoked`

## 障害時の一次切り分け
1. `401`: セッション期限切れ/未認証。再ログイン導線を案内
2. `403`: 権限不足。アカウントと共有状態を確認
3. `404`: 共有トークン不正や対象未存在。再発行/再読込を案内
4. `410`: 共有リンク失効/期限切れ。患者側で再発行

## 本番公開前の残課題
- DB移行（SQLite/PostgreSQL等）と migration 設計
- セッション保存先の外部化（Redis等）
- 監査ログの改ざん検知・長期保管方針
- 監視（4xx/5xx, login失敗率, share発行/失効率）の可視化
