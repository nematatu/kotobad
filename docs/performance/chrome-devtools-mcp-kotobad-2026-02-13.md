---
title: "Chrome DevTools MCP計測と初期改善（2026-02-13）"
date: "2026-02-13T10:40:00.000Z"
---

> **資料の位置づけ（2026-08-13追記）**
>
> 以下は2026-02-13時点の計測・変更記録です。現行コードでも`NoPost`の画像読込ヒントと`/_next/static/*`の1年`immutable`設定は確認できます。一方、`ThreadPostsStream`には現在`postCount`引数がなく、投稿0件時のSWRスキップは実装されていません。撤去理由はリポジトリから確認できません。

## 対象
- プロダクトURL: `https://kotobad.com`
- 計測日: 2026-02-13
- 計測手段: Chrome DevTools MCP Performance Trace

## 計測結果（実測）
### スロットリングなし
- `/`:
  - LCP: `376ms`
  - TTFB: `215ms`
- `/threads`:
  - LCP: `198ms`
  - TTFB: `94ms`
- `/threads/75`:
  - LCP: `321ms`
  - TTFB: `68ms`

### Fast 4G + CPU 4x slowdown（DevTools Emulation）
- `/threads/75`:
  - LCP: `1108ms`
  - LCP breakdown:
    - TTFB: `77ms`
    - Load delay: `828ms`
    - Load duration: `173ms`
    - Render delay: `31ms`

## ボトルネック（実測）
- `/threads/75` のLCP要素は `file.svg`（投稿ゼロ時のイラスト）
- LCP Discovery Insight:
  - `fetchpriority=high`: FAILED
  - lazy load not applied: FAILED
  - initial documentでのdiscoverability: FAILED
- `/_next/static/*` のレスポンスヘッダーは `Cache-Control: public, max-age=0, must-revalidate`（CSS/JS/画像で確認）

## 実施した改善（コード変更）
1. `/threads/[id]` で `thread.postCount===0` の場合、投稿取得SWRをスキップ
- `ThreadDetailHeader` で取得していたスレッド情報を `page.tsx` で一度だけ取得し、`postCount` を `ThreadPostsStream` に渡す構成へ変更
- 投稿ゼロ時は投稿APIを叩かず `NoPost` を初期描画する

2. `NoPost` の画像読込ヒントを追加
- `priority` / `fetchPriority="high"` / `sizes` を付与

3. `/_next/static/*` のキャッシュヘッダーを長期キャッシュに変更
- `next.config.js`:
  - 変更前: `public, max-age=0, must-revalidate`
  - 変更後: `public, max-age=31536000, immutable`

## 検証ステータス
- 検証済み:
  - 計測値（上記）
  - 実装差分
- 未検証:
  - 本番デプロイ後の再計測値（本変更はローカル実装段階）

## localhost:3000 追加検証（2026-02-13）
- 対象: `http://localhost:3000/threads/41`（投稿0件スレッド）
- 検証結果:
  - ネットワークに `GET /threads/api/posts/getPostByThreadId/41` が出ていない（投稿0件時のSWRスキップが有効）
  - LCP画像 `file.svg` の `fetchpriority=high` を確認
  - LCP Discoveryの3チェックはすべてPASS
- 実測LCP（スロットリングなし, 3回）:
  - `382ms`, `313ms`, `356ms`（中央値 `356ms`）
