# Repository Guidelines

## プロジェクト構成とモジュール配置
このリポジトリは Bun のワークスペースとして構成され、基幹モジュールは3つです。`packages/frontend` は Next.js アプリと UI コンポーネント、公開アセット（`public/`）を管理します。`packages/backend` は Hono を用いた Cloudflare Worker で、DB スキーマは `drizzle/`、Wrangler 設定は `wrangler.jsonc` にまとまっています。共通の型やバリデーションは `packages/shared/src` を唯一のソースとし、フロント・バック両方から参照してください。

## ビルド・テスト・開発コマンド
- `bun install`：ワークスペース全体の依存関係をインストールします。
- `bun dev`：フロントエンドとバックエンドをフィルタ付きで同時起動します。
- `bun dev:frontend` / `bun dev:backend`：個別サービスをホットリロード付きで起動します（バックエンドは `localhost:8787`）。
- `bun --filter '@kotobad/frontend' build`：Next.js の本番ビルドを生成し、必要に応じて `preview` で Cloudflare Pages をドライランします。
- `bun --filter '@kotobad/backend' generate`：Drizzle の SQL アーティファクトを更新し、続けて `local:migration` または `remote:migration` で D1 を適用します。
- `bun run format`：Biome による整形と推奨リンティングを一括実行します。

## コーディングスタイルと命名規約
`biome.json` に従い、TypeScript/TSX はタブインデントとダブルクォートを使用してください。React コンポーネントや公開モジュールは `PascalCase`、ユーティリティ関数は `camelCase`、共有スキーマは `{Domain}Schema`（例：`UserProfileSchema`）の形式を推奨します。スタイルやフックはコンポーネント近傍に配置し、再利用するユーティリティは `index.ts` で再エクスポートしてインポートパスを浅く保ちます。

## テストガイドライン
自動テストは未整備のため、新機能を追加する際は `packages/<module>/src/__tests__` に `bun test` 用のスイートを新設してください。ファイル名は `<unit>.test.ts` とし、外部サービスはスタブ化します。認証や D1 マイグレーションなど重要なフローを変更した場合は、PR に手動検証手順や `wrangler d1 execute ... --local` の結果を記録して共有します。

## コミットとプルリクエスト
コミット履歴は Conventional Commits（`feat:`, `fix:`, `chore:` など）に沿っています。件名は 72 文字以内で変更内容を明示してください。PR には目的、主な変更点、検証結果（スクリーンショットや `curl` 例）、関連 Issue（`closes #123`）を記載し、影響するモジュールのメンテナにレビューを依頼します。提出前に `bun run format` と該当サービスの起動確認を済ませてください。

## 環境設定とデプロイの注意点
Cloudflare のシークレットは `wrangler secret put` で投入し、`.dev.vars` 等はコミットしません。新しい環境変数を追加した場合は README や Workflow も更新してください。フロントエンドのデプロイは `bun deploy:frontend`、Worker は `bun deploy:backend` を使用し、事前に DB マイグレーション適用と `packages/frontend/public` のアセット更新を確認してから順次実行するのが安全です。

日本語でレビューを行ってください
