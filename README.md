# 体調日記（デモ版）

## 目的
このリポジトリは、日々の体調記録をAIで整理し、必要時に医師共有できるデモアプリです。

## 主要ドキュメント
- `docs/mvp-v0.1.md`: MVP範囲
- `docs/safety-requirements-v0.1.md`: 安全要件
- `docs/ai-platform-architecture-v0.1.md`: AI中心アーキテクチャ
- `docs/core-api-spec-v0.1.md`: API仕様（読みやすい版）
- `docs/data-model-v0.1.md`: 最小データモデル
- `docs/demo-runbook-v1.md`: デモ実施手順（3分版）
- `docs/render-deploy-v1.md`: Render常時公開の手順
- `docs/legal-prelaunch-checklist-v1.md`: 公開前リーガルチェック（実装タスク付き）

## 実装用ファイル
- `core/spec/openapi-v0.1.yaml`: OpenAPI雛形
- `core/config/safety-rules-v0.1.json`: 緊急判定・禁止表現ルール
- `core/config/symptom-category-map-v0.1.json`: 症状カテゴリ -> 受診科マップ

## 現在の主要機能
- 日記入力: タップ + スライダー + 音声（メモ追記/コマンド）
- AI出力: 今日の要約、7日傾向、次の一歩、相談先候補
- 近隣提案: 位置情報（任意）を使った近い医療機関の候補並び替え
- 安全機能: 緊急ワード判定、リスク表示、音声入力直後の自動チェック
- 同意管理: 初回同意モーダル、同意未登録時の保存ブロック（記録/プロフィール/共有）
- 公開文書: `/privacy`（プライバシーポリシー）、`/terms`（利用規約）
- マイページ: プロフィール、カレンダー、推移グラフ、記録統計
- 医師共有: 医師向けサマリーJSON、期限付き共有リンク（発行/失効）
- 医師ビュー: 別ページ閲覧、医師ログイン、医師コメント保存
- 医師キュー: AI補助による患者優先度リスト（最優先/高/中/低）
- 受け取り: 医師コメントが患者マイページへ反映
- データ管理: JSONエクスポート、`src/repositories/store-repository.mjs` 経由で永続化（既定: `data/store.json`）

## AIコア層の構成
`src/server.mjs` はルーティングとI/Oに寄せ、AI判断は `src/services` 配下に分離しています。

- `src/services/safety-service.mjs`
  - `evaluateSafety`（high/medium/low 判定、監査ID付与）
- `src/services/trend-service.mjs`
  - `average`, `computeTrend`（improving/stable/worsening 判定）
- `src/services/next-step-service.mjs`
  - `makeNextStep`（行動提案の分岐）
- `src/services/provider-matching-service.mjs`
  - `classifyCategory`, `matchProviders`（カテゴリ推定と相談先候補）
- `src/services/doctor-summary-service.mjs`
  - `buildDoctorSummary`（医師共有サマリーの組み立て、`image_evidence` を含む）

## データ保存構造（Repository層）
`src/server.mjs` は `src/repositories/store-repository.mjs` の interface を呼び、永続ファイルを直接操作しません（既定: `data/store.json`、本番は `DATA_DIR` で切替）。

- 永続対象:
  - `logs`
  - `profiles`
  - `shareLinks`
  - `shareAccessLogs`
  - `doctorNotes`
  - `doctorSessions`
  - `auditLogs`
- 目的:
  - serverの責務をAPI制御に限定
  - 将来のDB移行時に repository 実装差し替えで対応可能にする

## 認証仕様（医師）
- ログインAPI: `POST /api/v1/doctor/auth/login`
- セッション確認: `GET /api/v1/doctor/auth/me`
- ログアウト: `POST /api/v1/doctor/auth/logout`
- Cookie:
  - 名前: `doctor_session`
  - 属性: `Path=/; HttpOnly; SameSite=Lax; Max-Age=<秒>; Expires=<UTC>`（必要時 `Secure`）
- セッション失効時:
  - `401 doctor_session_expired`
  - フロント側では再ログイン導線を表示
- 不正セッション時:
  - `401 doctor_auth_invalid_session`
  - Cookieをクリアして再ログインを促す
- ログイン試行制限（簡易）:
  - 既定: 10分ウィンドウで5回失敗で一時ロック
  - 制限中は `429 too_many_login_attempts` と `Retry-After` を返却

## 監査ログ仕様（概要）
- 保存先: `auditLogs`（既定: `data/store.json`）
- 主なイベント:
  - `doctor.login.success`
  - `doctor.login.failure`
  - `doctor.view.read`
  - `doctor.comment.saved`
  - `share.link.issued`
  - `share.link.revoked`
- 監査ログ最小項目:
  - `event_id`
  - `event_type`
  - `actor`（doctor_id または user_id）
  - `target`（share_id / session_id 等）
  - `created_at`
  - `metadata`（最小限、PII過多を避ける）

### AI挙動を変えるときの編集ポイント
- 安全判定ルールそのものを変える: `core/config/safety-rules-v0.1.json`
- 症状カテゴリ/診療科マップを変える: `core/config/symptom-category-map-v0.1.json`
- 判定ロジックを変える:
  - safety: `src/services/safety-service.mjs`
  - trend: `src/services/trend-service.mjs`
  - next-step: `src/services/next-step-service.mjs`
  - provider matching: `src/services/provider-matching-service.mjs`
  - doctor summary: `src/services/doctor-summary-service.mjs`

## ローカル起動（実装済み最小API）
1. `npm start`
2. ヘルスチェック: `curl http://localhost:8787/health`
3. システム状態: `curl http://localhost:8787/api/v1/system/status`
4. ブラウザ確認: `http://localhost:8787/`
5. 保存データ: `data/store.json`（再起動後も保持）
6. 音声入力: ブラウザで「🎤 音声スタート」ボタン（Web Speech API対応環境）
7. 読み上げ: 「🔊 読み上げ」または「自動読み上げ」でAI返答を音声化（SpeechSynthesis対応環境）
8. 音声コマンド: 「保存して」「記録して」でそのまま保存、認識直後に安全チェックも自動実行
9. 簡易チェック: `npm run check`
10. 最終確認開始: `npm run qa`（手順は `docs/final-qa-checklist-v0.1.md`）

### 環境変数（本番向けを含む）
- `DATA_DIR`: 永続データディレクトリ（既定: `./data`）
- `DATA_STORE_PATH`: storeファイルのフルパス（未設定時は `DATA_DIR/store.json`）
- `UPLOAD_DIR`: 画像保存先（未設定時は `DATA_DIR/uploads`）
- `DOCTOR_COOKIE_SECURE`: `true/false`（既定は `NODE_ENV=production` なら `true`）
- `STRICT_PROD_DOCTOR_CRED_GUARD`: `true/false`（`true` の場合、本番でデモ医師認証値のまま起動を停止）
- `OPENAI_API_KEY`: 音声ファイル文字起こしを有効化
- `CONSENT_VERSION`: 保存系APIで要求する同意バージョン（既定: `consent_v1`）

## 外出先から常時アクセスする方法（Macを閉じても見られる構成）
ローカルPC配信ではなく、クラウドへデプロイします。  
このリポジトリには Render 用の `render.yaml` を追加済みです。

1. GitHubへこのプロジェクトをPush
2. Renderで `New +` -> `Blueprint` を選び、対象リポジトリを指定
3. `render.yaml` の内容でWebサービス作成（本番向け: `plan: starter` / 永続Disk `/var/data`）
4. `OPENAI_API_KEY` を使う場合だけRenderのEnvironmentで設定
5. デプロイ完了後、RenderのHTTPS URLでアクセス

詳細手順は `docs/render-deploy-v1.md` を参照。

### 医師ログイン（デモ）
- 医師ページ: `http://localhost:8787/doctor`
- ログインページ: `http://localhost:8787/doctor-login`
- 初期値（デモ用）:
  - メール: `doctor@example.com`
  - パスワード: `doctor1234`
- 環境変数で変更可能:
  - `DOCTOR_DEMO_EMAIL`
  - `DOCTOR_DEMO_PASSWORD`

### 医師共有の流れ（デモ）
1. 患者側マイページで `共有リンク発行(24h)` を押す
2. 発行された `医師ビューを開く` を開く（`/doctor?token=...`）
3. 未ログイン時は `/doctor-login` に自動遷移するため、`doctor@example.com / doctor1234` でログイン
4. 医師ビューでサマリー閲覧・コメント保存
5. 患者側の `医師から共有されたコメント` に反映

### 画像付き記録の流れ（デモ）
1. 患者側の記録画面で画像を添付して保存（対応形式: JPEG / PNG / WebP / GIF、3MB以下）
2. 共有リンクを開いた医師ビューの `画像メモ` でサムネイルを確認
3. サムネイルをクリックして拡大モーダル表示
4. モーダルは `閉じる` ボタン、背景クリック、`Esc` キーで閉じる

### デモ時によく出るエラー表示（ユーザー向け）
- 画像サイズ超過: `画像サイズは3MB以下にしてください`（添付時）/ `画像サイズが上限を超えています。3MB以下の画像を選択してください`（保存時）
- 画像形式不正: `画像形式は JPEG / PNG / WebP / GIF のみ対応しています`（添付時）/ `画像形式が不正です。JPEG / PNG / WebP / GIF を選択してください`（保存時）
- トークン不正: `共有トークンが無効です。患者さんに共有リンクの再発行を依頼してください。`
- トークン期限切れ/失効: `共有リンクの有効期限が切れたか失効しています。患者さんに再発行を依頼してください。`
- 医師未ログイン: `この操作には医師ログインが必要です。`

### 全ブラウザで音声入力する場合
- `🎤 音声スタート` は自動で2モード切替:
  - SpeechRecognition対応ブラウザ: 直接文字起こし
  - 非対応ブラウザ: 録音 -> サーバー文字起こしAPI
- 録音フォールバックを使う場合は `OPENAI_API_KEY` を設定
- 設定例は `.env.example` を参照

## スマホ実機で見る方法
1. PCとスマホを同じWi-Fiに接続
2. PCで `npm start` を実行
3. PCのIPアドレスを確認（例: `192.168.1.20`）
4. スマホブラウザで `http://<PCのIP>:8787/` を開く

### 一時公開（デモ向け）
常時運用ではなく短時間のデモだけなら、Cloudflare Tunnelで一時公開できます。

1. PCで `npm start`
2. 別ターミナルで `cloudflared tunnel --url http://localhost:8787`
3. 表示された `https://*.trycloudflare.com` を共有

### 動作確認例
```bash
curl -X POST http://localhost:8787/api/v1/logs/daily \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":"u_123",
    "recorded_at":"2026-02-27T09:15:00+09:00",
    "symptoms":["頭痛","不眠"],
    "symptom_score":6,
    "mood_score":4,
    "sleep_hours":5.5,
    "sleep_quality_score":3,
    "medication_status":"taken",
    "note":"午後にだるさが強い"
  }'

curl "http://localhost:8787/api/v1/insights/daily-summary?user_id=u_123&date=2026-02-27"
curl "http://localhost:8787/api/v1/insights/trend?user_id=u_123&window_days=7"
curl "http://localhost:8787/api/v1/match/providers?user_id=u_123"
curl "http://localhost:8787/api/v1/insights/next-step?user_id=u_123"
curl "http://localhost:8787/api/v1/profile?user_id=u_123"
curl "http://localhost:8787/api/v1/user/export?user_id=u_123"
curl "http://localhost:8787/api/v1/logs/range?user_id=u_123&from=2026-02-01&to=2026-02-27"
curl "http://localhost:8787/api/v1/logs/recent?user_id=u_123&limit=5"
curl "http://localhost:8787/api/v1/logs/by-date?user_id=u_123&date=2026-02-27"
curl "http://localhost:8787/api/v1/logs/calendar?user_id=u_123&month=2026-02"
curl "http://localhost:8787/api/v1/logs/stats?user_id=u_123"
curl "http://localhost:8787/api/v1/share/doctor-summary?user_id=u_123&window_days=14"
curl "http://localhost:8787/api/v1/patient/doctor-notes?user_id=u_123"

curl -X POST http://localhost:8787/api/v1/safety/evaluate \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u_123","text":"胸が強く痛いし息が苦しい"}'

curl -X POST http://localhost:8787/api/v1/consent \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u_123","agreed":true}'

curl -X POST http://localhost:8787/api/v1/share-links \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u_123","expires_hours":24,"window_days":14}'

curl -X POST http://localhost:8787/api/v1/doctor/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"doctor1234"}'

curl -X POST http://localhost:8787/api/v1/dev/seed-demo \
  -H "Content-Type: application/json" \
  -d '{"user_id":"u_123","days":45,"clear_existing":true}'
```
