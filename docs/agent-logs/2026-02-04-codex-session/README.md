# Codex セッションログ（AI向け・全体整理）

## 目的（AI向け）
- 新しいAIエージェントが**このドキュメントのみで**前提・背景・変更点・未解決点を把握し、
  現在の状態から**シームレスに継続**できるようにする。
- 人間の理解よりも **AIが誤解なく引き継げることを優先**する。

---

## 0. プロダクト概要（AI向け）
- プロダクト名: **kotobad（コトバド）**
- 概要: **バドミントン掲示板（スレッド投稿・閲覧）**
- 主機能:
  - スレッド一覧・スレッド詳細・投稿
  - 認証（/auth, /auth/login）
  - タグ付きスレッド（総合/ツアファ/日本代表/インターハイ など）
  - スレッド検索（タイトル検索）
- 主目的:
  - スレッド数の増加に耐える設計
  - キャッシュ/ISR/静的配信の安全運用

---

## 1. リポジトリ構成（重要）
- `packages/frontend` : Next.js (App Router) フロント
- `packages/backend` : Hono API (Drizzle + D1)
- `packages/shared`  : 型・schema・共通定数
- `scripts/`         : ビルド/検証用スクリプト
- `docs/incidents`   : 障害/運用メモ

---

## 2. スタック / 実行環境
- Next.js 15.4.6 / React 19
- Cloudflare Workers + OpenNext
- D1 / R2 / Durable Objects
- Hono (backend)
- Bun

---

## 3. ユーザーの強い制約・要求（必読）
- **敬語で回答すること。**
- 余計な変更・仮定・推測をしない。
- **勝手にマイグレーションを作らない。**
- **SQLを勝手に書かない。Drizzle 経由のみ。**
- **強引な型キャスト禁止**（例: `as unknown as ...` はNG）。
- **コードフォーマットで全行変更を出さない**（package.jsonの整形NG）。
- 変更は**小さく・正確に・必須のみ**。
- 余計なファイル生成（migrations/meta 等）を勝手に作らない。

---

## 4. セッションで扱った主要トピック一覧（全体像）
### A) フォント/静的アセット 404 → CPU time limit（最重要）
- 旧 CSS が削除済み woff2 を参照し続け、iOS で 404 が連発
- Workers が hung / CPU time limit で落ちる
- キャッシュ削除後も一部で再発
- **ビルド成果物参照整合性チェック**の導入へ

### B) キャッシュ戦略 / ISR
- ユーザーは **「ISRを使わない方針」**
- キャッシュ強制OFFを試行 → その後、静的キャッシュは維持したい方針へ
- `Cache-Control: no-store` の影響や Next.js の動的警告が出た

### C) スレッド検索
- UI: タイトル検索, 入力停止で自動検索（デバウンス）
- 検索 API: Drizzle 経由で LIKE 検索
- useCallback/useEffect の依存関係や再生成の説明
- 404 /threads/api/threads/search の原因調査

### D) UI/UX
- 入力フォーカス時のボーダー・アイコン色変更
- 検索の「2文字以上」エラー表示タイミング制御
- 検索結果表示のチカチカ（領域確保）
- 左寄せレイアウト

### E) ビルド・デプロイ
- OpenNext Cloudflare ビルド
- `initOpenNextCloudflareForDev` 未定義で build 失敗
- wrangler r2 object list の誤用
- CIでビルド後にスナップショット検証・保存を実行

---

## 5. フォント/静的アセット問題の詳細
### 5-1. 問題
- `/_next/static/media/*.woff2` が 404 連発
- 端末キャッシュ削除後も再発
- Workers CPU time limit / hung

### 5-2. 根本原因
- **古い CSS/JS が参照するアセットが新ビルドで削除**
- 端末が古い CSS を使い続け、存在しないアセットを再取得

### 5-3. 採用した解決策（概要）
- CSS/JS から `/_next/static/...` を抽出
- 前回スナップショット（R2）と比較
- 消えている参照があれば **ビルド失敗**
- 正常なら **スナップショットを更新**
- 誤検知（`/_next/static/media/` ディレクトリ参照）は除外

### 5-4. 関連ドキュメント
- `docs/incidents/2026-02-04-next-static-assets-404-incident.md`

---

## 6. 実装（スナップショット検証）
### 6-1. スクリプト
- `scripts/check-save-next-static-assets.ts`

主な処理:
- `.open-next/assets/_next/static` 配下 `.css/.js` を走査
- 正規表現で `/_next/static/...` 参照抽出
- `isAssetRef` で **拡張子がある参照のみ**保存（ディレクトリ除外）
- R2 から前回スナップショット取得
- 欠損参照があれば **ビルド失敗**

補足:
- `isAssetRef` は `/_next/static/media/` などの誤検知を防ぐために必要

### 6-2. 環境変数
- ローカルのスナップショットは一時ファイルに保存し、実行終了後に自動削除（`SNAPSHOT_FILE` を指定した場合のみ残る）
- `R2_SNAPSHOT_BUCKET` **必須**（例: `kotobad-assets-snapshot`）
- `R2_KEY` **必須**（例: `ops/next-static-assets-snapshot.json`）
- `WRANGLER_CONFIG` 任意（default: `wrangler.jsonc`）
- `WRANGLER_BIN` 任意（default: `wrangler`）

注意:
- エラーメッセージに `R2_BUCKET` が残っているため文言統一が必要

### 6-3. package.json（frontend）
- `packages/frontend/package.json`
- **deploy は変更しない**
- 追加:
  - `build:check-and-save-assets`: `bun run cf:build && bun ../../scripts/check-save-next-static-assets.ts`

### 6-4. CI / Cloudflare Build command
- `bun run build:check-and-save-assets`

---

## 7. 検索機能まわり（AI向けメモ）
- 検索は **2文字以上**で実行
- 入力停止検知（デバウンス）で自動実行
- UI: 検索結果表示・エラー表示のチカチカ抑制（高さ確保）
- API: `/threads/api/threads/search`
- Drizzle の `like` 条件で **複数トークンを and**

---

## 8. セッションでの詳細Q&A（AI向け要約）
- `useCallback` の効果: 関数参照の安定化（useEffect 依存の再実行抑制）
- `refRegex`: `/_next/static/` 参照を抽出する正規表現
- `match[0]`: 正規表現一致全体文字列
- `JSON.stringify(obj, null, 2)`: 可読な整形出力
- `await stat(path)`: ファイル存在確認
- `mkdir(..., { recursive: true })`: `mkdir -p`
- `spawn(..., { stdio: "inherit" })`: 子プロセスのログをそのまま出す

---

## 9. 重要ログ（原文）
※ 詳細ログは `docs/incidents/2026-02-04-next-static-assets-404-incident.md` に集約
- Workers hung / CPU time limit / woff2 404 / R2 初回失敗 / 誤検知ログ

---

## 10. 現在のリポジトリ状態（参考）
```
M docs/_sidebar.md
M packages/frontend/package.json
?? docs/agent-logs/2026-02-04-codex-session/README.md
?? docs/incidents/2026-02-04-next-static-assets-404-incident.md
?? scripts/check-save-next-static-assets.ts
```
※ `git status` で再確認必須

---

## 11. 次のAIへの指示
- **敬語必須**。
- ユーザーの強い要望（勝手にやらない/整形しない/勝手にSQLやマイグレーション作らない）厳守。
- 中核は「R2スナップショット検証」「build command」「スクリプト修正」。
- 変更は**最小差分**で行う。

