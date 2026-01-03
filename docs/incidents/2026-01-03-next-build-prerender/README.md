# 2026-01-03 Next build prerender Zod error

## 概要
Next.js の `next build` が prerender 中に Zod で落ち、ビルドが失敗した。エラーは `threads[].author.name` が `undefined` になるケースと、タグ取得で `labels` テーブル参照が失敗するケース。

## 影響
- `bun run build` が `Exited with code 1` で失敗
- `/` および `/threads` の prerender が停止

## 発生条件
- `next build` 実行時に API を参照（`NEXT_PUBLIC_API_URL_PRODUCT` が `https://api.kotobad.com`）
- `getThreads` が `cache: "force-cache"` のため、古いレスポンスがキャッシュに残ると再利用される

## ログ抜粋
```
Error occurred prerendering page "/threads"
Error [ZodError]: [
  { "path": ["threads", 0, "author", "name"], "message": "Invalid input: expected string, received undefined" }
]
```
```
Failed to fetch thread via BFF Error: Fetch Error: 500
{"error":"Failed to fetch threads","message":"Failed query: select \"id\", \"name\" from \"labels\" \"labels\"\nparams: "}
```
```
Module not found: Can't resolve '@/components/common/tag/Tag'
./src/app/threads/components/view/tag/tagList.tsx
```

## 調査
- D1 整合性確認（remote）
  - `threads.author_id` の欠損: 0 件
  - `user.name` の空/NULL: 0 件
  - 旧 `users` テーブルとの紐付け: 0 件
- API レスポンス確認（`api.kotobad.com`）
  - `threads[].author.name` 欠損: 0 件

## 原因
- データ自体の欠損ではなく、**ビルド時に古いレスポンスがキャッシュから再利用**された可能性が高い。
- 併せて、タグ取得で **旧 `labels` テーブル参照が残っている/環境差分**があり 500 が発生。
- CI 環境（Linux・ケースセンシティブ）で `Tag.tsx` / `tag.tsx` の **大文字小文字不一致**が顕在化。

## 対処
- バックエンド側で互換対応を追加
  - `author.name` 欠損時にレガシー `users` を参照（不足時はエラーで落とす）
  - `tags` が存在しない環境では `labels` から読み替え（`iconType: "none"`）
- ビルド時のキャッシュ対策
  - `.next/cache` を削除
  - `NEXT_PUBLIC_CACHE_BUST` を付与して URL を変化させる
- コンポーネントのファイル名と import を **同じ大文字小文字に統一**
  - `tag.tsx` に合わせて `@/components/common/tag/tag` を使用

例:
```
rm -rf packages/frontend/.next/cache
NEXT_PUBLIC_CACHE_BUST=$(date +%s) bun run build
```

## 再発防止策
- `next build` 前にキャッシュをクリアする運用を固定化
- `NEXT_PUBLIC_CACHE_BUST` を CI/ビルドに必ず付与
- 本番 API のタグ取得が `tags` テーブル前提で動作するように DB 互換性を整理
- `api.kotobad.com` の紐付け Worker とデプロイ環境（top-level / production）を明示
- バックエンドの環境変数（ACCESS_SECRET/REFRESH_SECRET 等）を production に揃える
- コンポーネントの命名規約（PascalCase）と import の一致を PR レビューで確認

## 参考コマンド
```
# API レスポンスの欠損確認
curl -sS "https://api.kotobad.com/bbs/threads?page=1&v=$(date +%s)" \
| jq -r '[.threads[] | select(.author==null or (.author.name? | type!="string")) | .id] | "missing: \(.)"'

# D1 整合性確認
bunx wrangler d1 execute b3s-db --remote --command \
"select count(*) as missing from threads t left join user u on t.author_id = u.id where u.id is null;"
```

## ステータス
- 2026-01-03: 一旦ビルドエラー解消済み
