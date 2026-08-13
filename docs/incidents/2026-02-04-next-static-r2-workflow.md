# Next.js 静的アセット消失防止ワークフロー（R2）

## 背景
- Next.jsは `/_next/static/*` をハッシュ付きで出力する
- 旧HTML/旧CSSが端末に残っている間に、参照先アセットが削除されると404が発生する
- 404が大量に発生すると、ログ/CPUに悪影響が出る

## 目的
- 静的ファイルはキャッシュしたまま維持する
- 旧キャッシュが参照するアセットが消えないようにする
- デプロイ時に「消えてしまう参照」を事前に検知して止める

## ワークフロー（概要）
1. **ビルド後に成果物をスキャン**
   - `/_next/static/**/*.css|js` を読み、参照アセット一覧を抽出
2. **R2の前回スナップショットと比較**
   - 前回参照されていたアセットが欠けていれば、まず fallback origin から復旧を試みる
   - 復旧できない場合のみ **デプロイ中断**
3. **検査成功時に新スナップショットを保存**
   - 次回の比較用にR2へ保存する
   - 現行scriptはdeploy処理を含まないため、後続deployの成功前にsnapshotが更新される

## 使うスクリプト
- `scripts/check-save-next-static-assets.ts`
  - 1回の実行で **比較 + R2保存** まで行う

## 実際の流れ（ビルド後に実行）
```
cf:build
→ check+save（R2から取得して比較 → OKならR2保存）
→ deploy（必要な場合のみ）
```

## 注意
- ローカルのスナップショットは一時ファイルに保存し、実行終了後に自動削除される（リポジトリに残らない）
- 通常実行ではR2取得失敗やsnapshot不在をエラーとして停止する
- 初回baselineを作成するときだけ`ALLOW_MISSING_R2_SNAPSHOT=true`を明示する。このflagを通常buildへ常設しない
- 参照範囲は **CSS + JS（標準）**
- `url(/_next/static/...woff2)` のような参照に含まれる末尾 `)` などは、比較前に正規化して除去する
- URL queryはdisk pathとsnapshotから除去する
- 前回snapshotだけでなく、今回のCSS/JSが参照するassetも存在確認する
- 壊れたJSON、不正なsnapshot field、`/_next/static/`外へ解決されるpathはエラーとして停止する
- fallback origin は `ASSET_FALLBACK_ORIGIN` → `NEXT_PUBLIC_FRONTEND_URL` → `https://kotobad.com` の順で決定する
- 後続deployが失敗してもR2 snapshotは元へ戻らない。deploy成功後だけsnapshotを確定するtransaction処理は未実装

## 自動テスト
- `scripts/check-save-next-static-assets.test.ts`
- 一時assets、偽Wrangler、local HTTP serverを使い、scriptを別processとして実行する
- 旧snapshotの欠落assetをHTTP 200で復旧し、更新snapshotをputする経路を確認する
- HTTP 404で復旧できない場合に非0で終了し、snapshotをputしない経路を確認する
- R2 get失敗、不正JSON、不正path、今回build自身の欠落参照でputせず停止する経路を確認する
- `ALLOW_MISSING_R2_SNAPSHOT=true`を明示した初回だけbaselineをputする経路を確認する
- 実Cloudflare認証、remote R2、production origin、deploy後の配信はこのtestの対象外

## 参照先
- `docs/incidents/2026-02-04-next-static-cache-404.md`
