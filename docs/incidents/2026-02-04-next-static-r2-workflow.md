# Next.js 静的アセット消失防止ワークフロー（R2）

## 背景
- Next.jsは `/_next/static/*` をハッシュ付きで出力する
- 旧HTML/旧CSSが端末に残っている間に、参照先アセットが削除されると404が発生する
- 404が大量に発生すると、ログ/CPUに悪影響が出る

## 目的
- 静的ファイルはキャッシュしたまま維持する
- 旧キャッシュが参照するアセットが消えないようにする
- デプロイ時に「消えてしまう参照」を事前に検知して止める

## Production deployのワークフロー
1. **OpenNext build**
   - `.open-next/assets/_next/static`を生成する
2. **Guard prepare**
   - CSS/JSから今回の参照を抽出する
   - R2の前回snapshotを取得・検証する
   - 前回と今回の参照先を検査し、欠落assetをfallback originから復旧する
   - 今回の参照一覧をlocalのcandidate snapshotへ保存する。この段階ではR2を更新しない
3. **OpenNext production deploy**
   - 復旧済みの同一OpenNext成果物をdeployする
4. **Guard commit**
   - deploy成功後にcandidate snapshotをR2へ保存する

検査またはdeployが失敗した場合はcommitへ進まないため、未deployのsnapshotがR2へ先行することを防ぐ。

## 使うスクリプト
- `scripts/check-save-next-static-assets.ts`
  - `prepare`: 検査・復旧・candidate作成。R2 putは行わない
  - `commit`: candidateの再検証とR2 putだけを行う
  - 引数なし: 従来互換の`check-and-save`として、検査成功直後にR2へ保存する
- `scripts/deploy-frontend-production.ts`
  - productionのbuild、prepare、deploy、commitを順番に実行する
  - 成功・失敗・SIGINT・SIGTERMで一時directoryを削除する

## Productionでの実行経路
```
cf:build
→ prepare（R2取得 → 比較 → 復旧 → local candidate作成）
→ deploy --env production
→ commit（candidateをR2へ保存）
```

`packages/frontend`の`deploy`とrootの`deploy:frontend`がこのwrapperを呼ぶ。preview deployは対象外。

`build:check-and-save-assets`は互換維持のため残しており、OpenNext build後に引数なしの`check-and-save`を実行する。このcommandはproductionの二段階deployでは使用しない。

## 注意
- Production wrapperのsnapshotは一時directoryに保存し、正常終了・通常の失敗・SIGINT・SIGTERMで削除する
- 通常実行ではR2取得失敗やsnapshot不在をエラーとして停止する
- 初回baselineを作成するときだけ`ALLOW_MISSING_R2_SNAPSHOT=true`を明示する。このflagを通常buildへ常設しない
- 参照範囲は **CSS + JS（標準）**
- `url(/_next/static/...woff2)` のような参照に含まれる末尾 `)` などは、比較前に正規化して除去する
- URL queryはdisk pathとsnapshotから除去する
- 前回snapshotだけでなく、今回のCSS/JSが参照するassetも存在確認する
- 壊れたJSON、不正なsnapshot field、`/_next/static/`外へ解決されるpathはエラーとして停止する
- fallback origin は `ASSET_FALLBACK_ORIGIN` → `NEXT_PUBLIC_FRONTEND_URL` → `https://kotobad.com` の順で決定する
- deploy成功後のR2 putが失敗した場合、commandは非0で終了するが、完了したCloudflare deployは自動rollbackしない
- repository内にproduction deployの排他制御はない。並行deploy時のsnapshot競合はこのwrapperだけでは防げない
- SIGKILLやprocess自体の強制終了では、一時directoryのcleanupを保証できない

## 自動テスト
- `scripts/check-save-next-static-assets.test.ts`
- 一時assets、偽Wrangler、local HTTP serverを使い、scriptを別processとして実行する
- 旧snapshotの欠落assetをHTTP 200で復旧し、更新snapshotをputする経路を確認する
- HTTP 404で復旧できない場合に非0で終了し、snapshotをputしない経路を確認する
- R2 get失敗、不正JSON、不正path、今回build自身の欠落参照でputせず停止する経路を確認する
- `ALLOW_MISSING_R2_SNAPSHOT=true`を明示した初回だけbaselineをputする経路を確認する
- `scripts/deploy-frontend-production.test.ts`
- fake OpenNext、fake Wrangler、local HTTP serverを使い、wrapperを別processとして実行する
- 成功時のbuild → get/prepare → deploy → put/commit順序を確認する
- build失敗、復旧失敗、deploy失敗では後続処理とR2 putを行わないことを確認する
- deploy後のput失敗を非0で通知することを確認する
- SIGTERMを子process groupへ転送し、commitせず一時directoryを削除することを確認する
- 実Cloudflare認証、remote R2、production origin、実deploy後の配信は自動testの対象外

## 参照先
- `docs/incidents/2026-02-04-next-static-cache-404.md`
