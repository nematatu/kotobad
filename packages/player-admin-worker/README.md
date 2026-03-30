# Player Admin Worker

選手情報（`players` テーブル）の追加・更新用 Worker です。

## Scripts

```bash
bun run dev
bun run build:admin-ui
bun run deploy
bun run cf-typegen
```

`bun run deploy` は `--env production` でデプロイし、`APP_ENV=production` を適用します。

`bun run dev` は `--persist-to ../backend/.wrangler/state` を指定しており、
backend Worker と同じローカル D1 状態を参照します。
また、起動前に Vite で `/admin` 用の UI をビルドします。

## API

- `GET /` 管理UI（Vite）
- `GET /api/status` 疎通確認
- `GET /players` 一覧取得
- `GET /players/:id` 詳細取得
- `POST /players` 新規追加
- `PATCH /players/:id` 更新

`PLAYER_ADMIN_API_TOKEN` を設定した場合、`/players` 配下は
`Authorization: Bearer <token>` または `x-admin-token` / `x-api-key` が必須です。

本番（`APP_ENV=production`）では `PLAYER_ADMIN_API_TOKEN` 未設定時に
`/players` へのアクセスは `503 server_misconfigured` を返します（fail-close）。

## Security Notes

- CORS は `ALLOWED_ORIGINS`（カンマ区切り）に含まれる Origin のみ許可します。
- 開発環境では `http(s)://localhost` / `127.0.0.1` を追加で許可します。
- エラー詳細（`message`）のレスポンス返却は `APP_ENV=development` のみです。
- 管理UIはトークンを `localStorage` に保存しません（メモリのみ）。

## UI Source

- `admin-ui/`: Vite + React(TSX) の管理UI実装
