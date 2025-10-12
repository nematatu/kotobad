# kotobad - バドミントン掲示板

**kotobad**は、バドミントンに関する情報交換や議論を行うための掲示板アプリケーションです。
選手情報、大会結果、そしてコミュニティでの意見交換を一つのプラットフォームで提供します。

## このレポジトリについて

このプロジェクトは、バドミントン愛好家やファンのためのコミュニティプラットフォームです。以下の機能を提供しています：

### 主な機能

- **掲示板システム (BBS)**
  - スレッド形式の議論
  - ユーザー認証とログイン
  - スレッドへの投稿とコメント
  - ラベルによるスレッドの分類

- **選手データベース**
  - 選手プロフィール（日本語名、英語名、ふりがな）
  - 所属チーム情報
  - 生年月日

- **大会情報管理**
  - 国内大会の記録
  - 世界大会の記録
  - 選手の戦績管理
  - 大会カテゴリーとスケジュール

- **選手キャリア追跡**
  - 選手の経歴情報
  - 所属チームの履歴
  - 大会での実績

## 技術スタック

### フロントエンド
- **Next.js 15** - Reactフレームワーク
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Radix UI** - アクセシブルなUIコンポーネント
- **React Hook Form** - フォーム管理
- **Zod** - スキーマバリデーション

### バックエンド
- **Hono** - 軽量で高速なWebフレームワーク
- **Drizzle ORM** - TypeScript-firstなORM
- **SQLite (D1)** - Cloudflare D1データベース
- **JWT** - 認証トークン
- **Zod OpenAPI** - API仕様の自動生成

### インフラ・デプロイ
- **Cloudflare Workers** - サーバーレスコンピューティング
- **Cloudflare Pages** - 静的サイトホスティング
- **Cloudflare D1** - エッジデータベース
- **Bun** - 高速なJavaScriptランタイム

## プロジェクト構造

このプロジェクトはモノレポ構成になっています：

```
kotobad/
├── packages/
│   ├── frontend/    # Next.jsフロントエンドアプリケーション
│   ├── backend/     # Hono APIサーバー (Cloudflare Workers)
│   └── shared/      # 共有の型定義とスキーマ
├── package.json     # ワークスペース設定
└── biome.json      # コードフォーマッター設定
```

## セットアップ

### 依存関係のインストール

```bash
bun install
```

### 開発サーバーの起動

全てのパッケージを同時に起動:
```bash
bun run dev
```

フロントエンドのみ:
```bash
bun run dev:frontend
```

バックエンドのみ:
```bash
bun run dev:backend
```

### コードフォーマット

```bash
bun run format
```

## デプロイ

### フロントエンド
```bash
bun run deploy:frontend
```

### バックエンド
```bash
bun run deploy:backend
```

## データベース

このプロジェクトはCloudflare D1 (SQLite) を使用しています。

### マイグレーション

ローカル環境:
```bash
cd packages/backend
bun run local:migration
```

本番環境:
```bash
cd packages/backend
bun run remote:migration
```

### スキーマ生成
```bash
cd packages/backend
bun run generate
```

## ライセンス

このプロジェクトはオープンソースプロジェクトです。

---

Built with ❤️ for the badminton community
