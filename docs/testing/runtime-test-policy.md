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
- rootの`bun run test`から、Backend、Frontend、HTTP統合テストをすべて実行します。
- CIではruntime testとHTTP統合テストの後に、typecheck、Biome、Backend build、Frontend buildを実行します。

## Current Coverage

### Backend runtime test

- `packages/backend/src/middleware/csrf-origin.test.ts`
  - Honoへ実Requestを渡します。
  - 一致token、token欠落、token不一致、過長token、許可外Origin、Referer fallback、safe methodを確認します。
- `packages/backend/src/utils/formatZodValidationError.test.ts`
  - Zod errorのpathとfallbackを確認します。
- `packages/backend/src/middleware/api-docs-auth.test.ts`
  - API docs資格情報の解決を確認します。
  - `/doc`と`/specification`への実Requestは未確認です。

### Frontend runtime test

- `packages/frontend/src/app/threads/api/csrf-token/route.test.ts`
  - 本文tokenとcookie値の一致、64桁hex、ProductionとDevelopmentのcookie属性、`no-store`を確認します。
- `packages/frontend/src/middleware.test.ts`
  - unsafe methodの一致token、header欠落、token不一致、safe methodを確認します。
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
  - CSRF header欠落がFrontendで403となり、Backend handlerへ到達しないことを確認します。
  - 許可外OriginがBackendで403となり、Backend handlerへ到達しないことを確認します。
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
