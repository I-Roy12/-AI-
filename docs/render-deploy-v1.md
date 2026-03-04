# Renderデプロイ手順（常時公開）

この手順で、Mac mini の電源OFF/スリープ中でもアクセスできる構成にできます。

## 事前準備
- GitHub にこのプロジェクトをPushしておく
- Render アカウントを作成しておく

## 手順
1. Render ダッシュボードで `New +` -> `Blueprint` を選ぶ
2. GitHubリポジトリを接続して選択
3. `render.yaml` を読み込んでサービス作成
4. 初回デプロイ完了を待つ
5. 発行された `https://...onrender.com` のURLを開いて確認

## 追加設定（必要な場合のみ）
- 音声ファイル文字起こしを有効化する場合:
  - Render -> 対象サービス -> `Environment`
  - `OPENAI_API_KEY` を設定
  - `Manual Deploy` で再デプロイ

## データ保存について
- Renderの永続ディスクを `/var/data` にマウント済み（`render.yaml`）
- 保存対象:
  - `/var/data/store.json`
  - `/var/data/uploads/*`
- 再デプロイ後もデータ保持されます

## トラブル時の確認
- `GET /health` が `{"status":"ok"}` を返すか
- `GET /api/v1/system/status` で `voice_transcribe_enabled` と `data_dir` を確認
- 医師ログインが通らない場合:
  - `DOCTOR_COOKIE_SECURE=true` のまま HTTPS URL でアクセスしているか

