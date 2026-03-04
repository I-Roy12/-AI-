# 体調管理AIプラットフォーム設計 v0.1

## 1. 方針
- 作る対象は「アプリ」ではなく「AI本体（Platform Core）」とする
- UIは交換可能なクライアントとして扱う
- 安全制約はUIではなくCore側で強制する

## 2. 全体構成
- Client Layer
  - Web/PWA
  - iOS/Android（将来）
  - AIデバイス/音声クライアント（将来）
- AI Core Layer
  - Intake Service（記録受け取り）
  - Summary Service（要約）
  - Trend Service（傾向検知）
  - Safety Guard（危険判定と応答制御）
  - Match Service（受診先候補）
- Data Layer
  - Health Logs（体調記録）
  - Consent（同意）
  - Audit Logs（監査）
  - Provider Index（医師/医療機関候補）

## 3. Core責務
### Intake Service
- タップ/スライダー入力を正規化して保存
- 欠損項目の扱いを統一

### Summary Service
- 日次要約を生成（2-3行）
- 事実と推定を分離して出力

### Trend Service
- 7日/14日の変化を判定（改善/横ばい/悪化）
- 変化要因候補を返す

### Safety Guard
- 危険ワードと危険パターンを評価
- 危険時は通常出力をブロックして緊急導線へ切り替える

### Match Service
- 症状カテゴリを受診科候補へマッピング
- 医師候補を適合度順で返却

## 4. 安全制約の適用位置
- すべてのAI応答はSafety Guardを通す
- 診断断定ワードをレスポンスフィルタで除外
- 危険判定時は「通常応答停止」が必須

## 5. インターフェース原則
- APIはチャネル非依存（Web/モバイル/デバイス共通）
- レスポンスに必ず以下を含める:
  - `disclaimer`（診断ではない）
  - `confidence`（低/中/高）
  - `evidence`（根拠データ）

## 6. 非機能要件（MVP）
- 可用性: 日次入力API成功率 99.5%以上
- 遅延: 記録送信から要約返却まで 2秒以内（p95）
- 追跡性: すべての提案に監査IDを付与
- 同意管理: 共有は明示同意がある場合のみ

## 7. 拡張戦略
- 将来、LLMや推論器を差し替えてもAPI契約は維持
- 医療機関連携はProvider Gatewayとして外出し
- AIデバイス連携はClient Adapter追加で対応
