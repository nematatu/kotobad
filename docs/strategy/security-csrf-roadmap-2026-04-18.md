# kotobad セキュリティ対策メモ（2026-04-18、2026-08-13更新）

## 目的
- 現在の実装状況（検証済み）と、今後の実施項目を整理する。
- CSRF対策を中心に、BFF/Backendの防御責務を明確化する。

## 検証済み（コード確認済み）
### 1. Cookie設定（better-auth）
- `useSecureCookies: true` を設定済み。  
  参照: `packages/backend/src/auth.ts`
- better-auth の cookie デフォルト属性は `sameSite: "lax"` / `httpOnly: true`。  
  参照: `node_modules/better-auth/dist/cookies/index.mjs`

### 2. Backend の Origin/Referer チェック
- `/bbs/*` に `csrfOriginMiddleware` を適用済み。  
  参照: `packages/backend/src/routes/index.ts`
- unsafe method（GET/HEAD/OPTIONS以外）で `Origin/Referer` を検証し、許可外は403。  
  参照: `packages/backend/src/middleware/csrf-origin.ts`

### 3. Content-Type の現状
- 多くの更新系は `application/json` 前提（`c.req.valid("json")`）で実装済み。
- 例外として `multipart/form-data` が必要なAPIあり。
  - `bbs/media/upload`
  - `bbs/users/update`

### 4. BFF/Backend の通信実態（重要）
- 「常にBFF経由のみ」は不正確。  
  Frontendサーバー側コードから Backend URL を直接呼ぶ実装が存在する。  
  参照: `packages/frontend/src/app/threads/lib/getThread.ts` など

### 5. Frontend / Backend CSRFトークン検証（2026-08-13確認）
- BFF（Next Route Handler）側では `/threads/api/` 配下の unsafe method に対して、cookie と `X-CSRF-Token` の照合を実装済み。
  参照: `packages/frontend/src/middleware.ts`
- CSRFトークン発行Route Handlerを実装済み。
  参照: `packages/frontend/src/app/threads/api/csrf-token/route.ts`
- CSRF cookieは`HttpOnly`、`Path=/`、`SameSite=Strict`、`Max-Age=3600`です。本番のみ`Secure`を付け、cookie名は`__Host-csrf_token`（開発時は`dev_csrf_token`）です。Domainは指定していません。
  参照: `packages/frontend/src/app/threads/api/csrf-token/route.ts`
- BFFの`bffFetcher`は、受信requestの`x-csrf-token`をBackend APIへ転送します。
  参照: `packages/frontend/src/lib/api/fetcher/bffFetcher.ts`
- Backend `/bbs`では、`Origin/Referer`に加えて`X-CSRF-Token`とCSRF cookie（`__Host-csrf_token`または`dev_csrf_token`）を照合します。
  参照: `packages/backend/src/middleware/csrf-origin.ts`
- BackendのCORS allow headersにも`X-CSRF-Token`を追加しています。
  参照: `packages/backend/src/routes/index.ts`

### 6. BFF -> Backend の内部認証（2026-05-04確認）
- BFFからBackend APIへHMAC署名ヘッダーを付与済み。
  参照: `packages/frontend/src/lib/api/fetcher/bffFetcher.ts`
- Backend `/bbs/*` でHMAC署名ヘッダーを検証済み。
  参照: `packages/backend/src/middleware/internal-auth.ts`
- `OPTIONS` と `/bbs/realtime/` はinternal auth検証の例外。
  参照: `packages/backend/src/middleware/internal-auth.ts`

## 自動テストの検証範囲と未確認事項（2026-08-13確認）

### 1. セキュリティ回帰テスト
- Backend CSRF middlewareは、一致token、欠落、不一致、過長token、許可外Origin、Referer fallback、safe methodのruntime testを追加済みです。
- Backend internal auth middlewareは、header欠落、不正署名、過去・未来timestamp、method・path・query改変、`OPTIONS`・realtime例外、正常通過のruntime testを追加済みです。
- 実`mainRouter`へのRequestで、CSRF不正403、CSRF正常・HMAC欠落403、CSRF・HMAC正常後の404を確認し、`/bbs/*`のmiddleware登録順を固定しています。
- CSRF token Route Handlerは、本文とcookieのtoken一致、ProductionとDevelopmentの属性をruntime testで確認済みです。
- Frontend middleware、Browser側fetcherのtoken付与と403再試行、Server側BFFのCookie・Origin・CSRF・HMAC header転送をruntime testで確認済みです。
- `scripts/test-csrf-request-chain.ts`で、Next.js開発serverからテスト用Hono serverまでの実HTTP経路を確認済みです。
- 実Browserのcookie制御とCloudflare本番を含むE2Eシナリオは未確認です。

## 今後の実施項目（優先順）
### P1: 先に必須
1. Backend CSRFトークン照合とBFFからのheader転送は実装済みです（2026-08-13）。
2. CSRF middleware、Frontend middleware、Client/Server fetcherの回帰テストを追加済みです。
3. Next.js開発serverからテスト用Hono serverまでのHTTP統合テストを追加済みです。実BrowserとCloudflare本番は未確認です。

### P2: 早めに実施
1. `allowHeaders` への `X-CSRF-Token` 追加は実装済みです（2026-08-13）。
2. CSRF cookieの`Path`、`Domain`、`Max-Age`、`SameSite`、`Secure`を明示設定済みです（2026-08-13）。
3. `bffFetcher` / fetcher群の送信header・cookie付与ルールはruntime testで固定済みです。責務のコード上の統一は未実施です。

### P3: 継続改善
1. XSS対策の強化（出力エスケープ、CSP、危険なHTML挿入点の監査）
2. 監査ログ/アラート整備（403増加、異常Origin、失敗トークン）
3. 実Browserでcookie制約を確認し、Cloudflare本番Backendまで通すCSRF E2Eシナリオの自動化

## 補足メモ
- `application/json` 制限は補助策であり、単独ではCSRF対策にならない。
- 多層防御を採用する。
  - SameSite/HttpOnly/Secure
  - Origin/Referer
  - CSRFトークン
  - BFF/Backendそれぞれでの検証
