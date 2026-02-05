# 2026-02-04 Next.js static 404 (woff/css)

## 何が起きたか
- 旧HTML/旧CSSが端末に残った状態で、新ビルドで古い静的ファイルが消えた
- その結果、旧CSSが参照する `/_next/static/media/*.woff2` が 404 になった

## 原因
- Next.jsはHTML/CSS/JS/フォントをハッシュ名で出力
- 「古いHTMLが残る」+「古いstaticが消える」と404が起きる

## 影響
- 一部端末でフォント取得が失敗
- WorkerのCPU時間/ログに404が多発

## こちら側でできる再発防止
1. **HTML/RSCは短命にする**
   - `Cache-Control: no-store` or `must-revalidate`
   - 旧HTMLを早く切り替える
2. **`/_next/static/*` は消さない運用**
   - 旧ビルドのstaticを一定期間残す
   - 旧HTMLが参照しても404にならない
3. **パージはHTMLのみ**
   - Cloudflare purgeはHTMLパスだけ
   - `/_next/static/*` は消さない

## 仕組み (スクリプト)
- `scripts/check-next-static-assets.ts`
  - `--save` で「今のビルド成果物が参照するstatic一覧」を保存
  - 通常実行で「保存済みの一覧」をチェック
  - 旧参照先が削除されていれば失敗

### R2前提の運用
```
# デプロイ前 (R2から取得してチェック)
R2_BUCKET=kotobad-next-cache R2_KEY=ops/next-static-assets-snapshot.json \
WRANGLER_CONFIG=packages/frontend/wrangler.jsonc \
bun scripts/check-next-static-assets.ts

# デプロイ後 (R2へ保存)
R2_BUCKET=kotobad-next-cache R2_KEY=ops/next-static-assets-snapshot.json \
WRANGLER_CONFIG=packages/frontend/wrangler.jsonc \
bun scripts/check-next-static-assets.ts --save
```

## 注意
- スナップショットが無い状態での`check`は失敗する
- 最初の一回だけ `--save` を作る必要がある

## 運用メモ
- フォント/デザイン変更時は「旧static保持」が最重要
- ユーザーにキャッシュ削除を促さない設計にする
