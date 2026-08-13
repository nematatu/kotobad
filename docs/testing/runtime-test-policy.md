# Runtime test policy

## Summary

- 型チェック、Build、runtime test、HTTP統合テスト、Browser E2Eを区別します。
- Route Handlerやmiddlewareの変更は、実際の`Request`を使うruntime testを必須とします。
- Browser、Next.js BFF、Backendをまたぐ変更は、可能な限り実HTTP経路も検証します。
- 実行していない環境や外部サービスは「未確認」と報告します。

## Background

- TypeScriptの型チェックは、型整合性を確認します。
- Buildは、コンパイルとパッケージングを確認します。
- どちらも、HTTP response、cookie属性、middleware分岐、header転送、外部連携の動作を保証しません。
- 2026-08-13に、CSRF対策の確認が型チェックとBuildへ偏っていたため、検証基準と実HTTP統合テストを追加しました。

## Goals

- 変更したruntime経路を、成功ケースと拒否ケースの両方で確認します。
- CIでBackend、Frontend、BFF境界、FrontendからBackendまでのHTTP経路を継続確認します。
- 確認済み範囲と未確認範囲を、レビュー時に判別できる状態にします。

## Non-Goals

- ローカルHTTP統合テストを、実Browser E2EやCloudflare本番確認として扱いません。
- テスト用Hono serverを、ProductionのBackend全体として扱いません。
- Google OAuth、D1、R2、Durable Objectsなどの外部連携を、このCSRF統合テストでは確認しません。

## Scope

- Backend Hono middleware
- Frontend Route Handler
- Frontend middleware
- Browser側`BffFetcher`
- Server側`BffFetcherRaw`
- Next.js BFFからBackend middlewareまでのローカルHTTP経路
- `.github/workflows/ci.yml`の必須検証

## Requirements

- Route Handlerやmiddlewareを変更した場合は、実際の`Request`を渡すruntime testを追加します。
- セキュリティ変更では、成功、入力欠落、不一致、許可外入力の拒否ケースを確認します。
- BFFのheaderやcookie転送を変更した場合は、Backend向け`fetch`へ渡った値を確認します。
- 複数Application境界に影響する場合は、ローカルHTTP統合テストを追加します。
- 複数middlewareが同じstatusを返す拒否ケースでは、Application境界の受信数とresponse bodyを確認し、拒否した層を特定します。
- rootの`bun run test`から、Backend、Frontend、HTTP統合テストをすべて実行します。
- CIではruntime testとHTTP統合テストの後に、typecheck、Biome、Backend build、Frontend buildを実行します。Test stepは10分、Job全体は30分でtimeoutします。

## Current Coverage

### Backend runtime test

- `packages/backend/src/middleware/csrf-origin.test.ts`
  - Honoへ実Requestを渡します。
  - 一致token、token欠落、token不一致、過長token、許可外Origin、Referer fallback、safe methodを確認します。
- `packages/backend/src/utils/formatZodValidationError.test.ts`
  - Zod errorのpathとfallbackを確認します。
- `packages/backend/src/middleware/api-docs-auth.test.ts`
  - API docs資格情報の設定済み・未設定を確認します。
  - Honoへ実Requestを渡し、未設定時の503、認証なし・不正資格情報の401、正しいBasic Authによる`/doc`、`/doc/*`、`/specification`の200を確認します。
- `packages/backend/src/middleware/internal-auth.test.ts`
  - HMAC header欠落、不正署名、許容時間外の過去・未来timestampを拒否することを確認します。
  - 署名後のmethod、path、query改変を拒否し、`OPTIONS`と`/bbs/realtime/`の例外、正常通過を確認します。
- `packages/backend/src/routes/index.test.ts`
  - 実際の`mainRouter`へ実Requestを渡し、`/bbs/*`のmiddleware登録順を確認します。
  - CSRF不正時はCSRF middlewareの403、CSRF正常かつHMAC欠落時はinternal auth middlewareの403、両方正常なら未定義routeの404へ到達することを確認します。
  - D1やBetter Authを必要としない未定義routeに限定したテストです。

### Frontend runtime test

- `packages/frontend/src/app/threads/api/csrf-token/route.test.ts`
  - 本文tokenとcookie値の一致、64桁hex、ProductionとDevelopmentのcookie属性、`no-store`を確認します。
- `packages/frontend/src/middleware.test.ts`
  - unsafe methodの一致token、header欠落、token不一致、safe methodを確認します。
  - Productionでは`__Host-csrf_token`だけを受理し、Developmentでは`dev_csrf_token`だけを受理することを実`NextRequest`で確認します。
- `packages/frontend/src/lib/api/fetcher/bffFetcher.client.test.ts`
  - token取得、unsafe requestへのheader付与、403後のtoken再取得と1回の再試行を確認します。
- `packages/frontend/src/lib/api/fetcher/bffFetcher.test.ts`
  - Cookie、Origin、CSRF token、HMAC headerのBackend転送を確認します。
  - 呼び出し側headerの優先と`skipCookie`も確認します。

### Local HTTP integration test

- `scripts/test-csrf-request-chain.ts`
  - 実際のNext.js開発serverとテスト用Hono serverをloopbackで起動します。
  - `CSRF token発行 -> Next middleware -> setThreadLike Route Handler -> BffFetcherRaw -> Backend CSRF middleware -> Backend internal auth middleware`をHTTPで通します。
  - 正常requestが200でBackend handlerへ到達することを確認します。
  - CSRF header欠落がFrontendで`Invalid CSRF token.`の403となり、テスト用Backend serverへ到達しないことを受信数で確認します。
  - 許可外Originのrequestがテスト用Backend serverへ到達し、Backend CSRF middlewareで`Forbidden origin.`の403となることを、受信数、response body、Backend handler未到達で確認します。
  - テスト用Backend serverはOSが割り当てたportを使用し、Next.jsのbuild出力先と一時tsconfigは実行単位で分離します。通常の`packages/frontend/tsconfig.json`は実行前後の内容一致も検証します。
  - HTTP requestと子process終了にtimeoutを設け、正常・異常のどちらでもFrontend、Backend、build出力のcleanupをすべて試行します。
  - テスト用Hono serverはD1、Better Auth、本番routerを使用しません。

## Unverified Scope

- 実Browserによるcookie保存と送信
- Browserによる`SameSite`、`Secure`、`__Host-`制約の適用
- Production buildを起動したHTTP経路
- OpenNextとCloudflare Workers上のproxy挙動
- Production secretsとCloudflare Dashboard設定
- Google OAuth callback後のsession確立
- D1、R2、Durable Objectsを含む本番相当のE2E

## Acceptance Criteria

- `bun run test`がBackend、Frontend、HTTP統合テストを実行します。
- CSRFの成功ケースと主要な拒否ケースが自動化されています。
- CIで`bun run test`が必須です。
- テスト結果の報告で、runtime確認、typecheck/build確認、未確認範囲を分けます。

## Rollout / Test Plan

- `bun run test`
- `bun run typecheck`
- `bunx biome check`
- `bun run build:backend`
- `bun run build:frontend`
- GitHub Actions上の実行結果は、PR作成後に確認します。
- 実Browser E2EとCloudflare本番確認は未実施です。
