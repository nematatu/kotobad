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

## 未実装（検証済み）
### 1. CSRFトークン検証
- Backend `/bbs` で `X-CSRF-Token` と cookie の照合は未実装。
- BFF（Next Route Handler）側のCSRFトークン検証も未実装。

### 2. BFF -> Backend の内部認証
- 「BFFからの正規中継であること」を秘密情報で検証する仕組み（内部ヘッダー/HMAC等）は未実装。

## いま着手中（方針）
- Backendで CSRFトークン発行ルーターを作成する。

## 今後の実施項目（優先順）
### P1: 先に必須
1. Backend CSRFトークン発行・検証を実装
2. BFFのunsafe methodでトークン送信を実装（未対応だと全403になる）
3. BFFでもCSRF検証を実装（Browser入口防御）
4. Backendでもトークン検証を維持（最終防衛線）

### P2: 早めに実施
1. BFF -> Backend の内部認証（共有秘密ヘッダー/HMAC）
2. `allowHeaders` に `X-CSRF-Token` を追加
3. Cookie属性の見直し（Path/Domain/Max-Age含む）
4. `bffFetcher` / fetcher群の責務整理（送信ヘッダー・cookie付与ルールの統一）

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
