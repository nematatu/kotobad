# kotobad セキュリティ対策メモ（2026-04-18）

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

### 5. Frontend CSRFトークン検証（2026-05-04確認）
- BFF（Next Route Handler）側では `/threads/api/` 配下の unsafe method に対して、cookie と `X-CSRF-Token` の照合を実装済み。
  参照: `packages/frontend/src/middleware.ts`
- CSRFトークン発行Route Handlerを実装済み。
  参照: `packages/frontend/src/app/threads/api/csrf-token/route.ts`
- Backend `/bbs` では `X-CSRF-Token` と cookie の照合は未実装。
  Backend側は `Origin/Referer` とinternal authを防御層として使う構成。

### 6. BFF -> Backend の内部認証（2026-05-04確認）
- BFFからBackend APIへHMAC署名ヘッダーを付与済み。
  参照: `packages/frontend/src/lib/api/fetcher/bffFetcher.ts`
- Backend `/bbs/*` でHMAC署名ヘッダーを検証済み。
  参照: `packages/backend/src/middleware/internal-auth.ts`
- `OPTIONS` と `/bbs/realtime/` はinternal auth検証の例外。
  参照: `packages/backend/src/middleware/internal-auth.ts`

## 未実装・未確認（2026-05-04確認）
### 1. Backend CSRFトークン照合
- Backend `/bbs` で `X-CSRF-Token` と cookie の照合は未実装。
- 現状はfrontend middleware、Backend Origin/Referer、internal authの多層防御。

### 2. セキュリティ回帰テスト
- CSRFシナリオの自動テストは未確認。

## 今後の実施項目（優先順）
### P1: 先に必須
1. Backend CSRFトークン照合を追加するか、現状の防御層で十分かを判断する
2. セキュリティ回帰テストを整備する

### P2: 早めに実施
1. `allowHeaders` に `X-CSRF-Token` を追加する必要があるかを確認する
2. Cookie属性の見直し（Path/Domain/Max-Age含む）
3. `bffFetcher` / fetcher群の責務整理（送信ヘッダー・cookie付与ルールの統一）

### P3: 継続改善
1. XSS対策の強化（出力エスケープ、CSP、危険なHTML挿入点の監査）
2. 監査ログ/アラート整備（403増加、異常Origin、失敗トークン）
3. セキュリティ回帰テスト（CSRFシナリオの自動化）

## 補足メモ
- `application/json` 制限は補助策であり、単独ではCSRF対策にならない。
- 多層防御を採用する。
  - SameSite/HttpOnly/Secure
  - Origin/Referer
  - CSRFトークン
  - BFF/Backendそれぞれでの検証
