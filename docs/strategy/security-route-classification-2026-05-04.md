# kotobad セキュリティルート分類（2026-05-04）

## Summary

- 2026-05-04時点の実コードを確認し、frontend Next.js Route Handler と backend Hono routes を分類しました。
- 本文の分類は、確認済みのファイルに基づきます。
- 指定されたが実体がないRoute Handlerは「実体なし」と明記します。
- この文書では挙動変更は扱いません。

## Scope

- frontend: `packages/frontend/src/app/**/route.ts`
- backend: `packages/backend/src/routes/**`
- middleware: CSRF、better-auth、internal auth、BFF fetcher、CSP

## Verified Middleware

- frontend CSRF: `packages/frontend/src/middleware.ts`
  - `/threads/api/` 配下の unsafe method に対し、cookie と `x-csrf-token` を照合します。
  - `GET` / `HEAD` / `OPTIONS` は対象外です。
- frontend CSP: `packages/frontend/src/middleware.ts`
  - HTMLレスポンスにnonce付きCSPを付与します。
  - API/静的リソースはCSP nonce対象外です。
- BFF internal auth: `packages/frontend/src/lib/api/fetcher/bffFetcher.ts`
  - Backend API へ `x-internal-ts` と `x-internal-signature` を付与します。
- backend CSRF Origin/Referer: `packages/backend/src/middleware/csrf-origin.ts`
  - `/bbs/*` の unsafe method で `Origin` / `Referer` を検証します。
- backend internal auth: `packages/backend/src/middleware/internal-auth.ts`
  - `/bbs/*` にHMAC検証を適用します。
  - `OPTIONS` と `/bbs/realtime/` は例外です。
- backend better-auth: `packages/backend/src/middleware/better-auth.ts`
  - `c.set("betterAuthUser", { id, username })` を設定します。

## Frontend Route Handler Classification

| Route | 実体 | Method | 分類 | 認証 | CSRF | Backend internal auth |
| --- | --- | --- | --- | --- | --- | --- |
| `/auth/api/[...betterAuthPath]` | `packages/frontend/src/app/auth/api/[...betterAuthPath]/route.ts` | GET/POST/PUT/PATCH/DELETE/OPTIONS/HEAD | auth系 | better-auth側に委譲 | frontend middleware対象外 | なし |
| `/threads/api/csrf-token` | `packages/frontend/src/app/threads/api/csrf-token/route.ts` | GET | 公開GET / CSRF token発行 | 不要 | GETのため対象外 | なし |
| `/threads/api/media/upload` | `packages/frontend/src/app/threads/api/media/upload/route.ts` | POST | unsafe method / upload系 | backendで必須 | 対象 | 必須 |
| `/threads/api/notifications/count` | `packages/frontend/src/app/threads/api/notifications/count/route.ts` | GET | 認証必須GET / notifications系 | backendで必須 | GETのため対象外 | 必須 |
| `/threads/api/notifications/readAll` | `packages/frontend/src/app/threads/api/notifications/readAll/route.ts` | POST | unsafe method / notifications系 | backendで必須 | 対象 | 必須 |
| `/threads/api/notifications` | `packages/frontend/src/app/threads/api/notifications/route.ts` | GET | 認証必須GET / notifications系 | backendで必須 | GETのため対象外 | 必須 |
| `/threads/api/posts/createPost` | `packages/frontend/src/app/threads/api/posts/createPost/route.ts` | POST | unsafe method / 投稿・作成系 | backendで必須 | 対象 | 必須 |
| `/threads/api/posts/getPostByThreadId/[id]` | `packages/frontend/src/app/threads/api/posts/getPostByThreadId/[id]/route.ts` | GET | 公開GET | 任意session参照のみ | GETのため対象外 | 必須 |
| `/threads/api/posts/getReactionOptions` | `packages/frontend/src/app/threads/api/posts/getReactionOptions/route.ts` | GET | 公開GET / リアクション系 | 不要 | GETのため対象外 | 必須 |
| `/threads/api/posts/setPostReaction` | `packages/frontend/src/app/threads/api/posts/setPostReaction/route.ts` | POST | unsafe method / リアクション系 | backendで必須 | 対象 | 必須 |
| `/threads/api/threads/createThread` | `packages/frontend/src/app/threads/api/threads/createThread/route.ts` | POST | unsafe method / 投稿・作成系 | backendで必須 | 対象 | 必須 |
| `/threads/api/threads/getAllThreads` | 実体なし | 不明 | 指定あり・実体なし | 不明 | 不明 | 不明 |
| `/threads/api/threads/getThreadById/[id]` | 実体なし | 不明 | 指定あり・実体なし | 不明 | 不明 | 不明 |
| `/threads/api/threads/search` | `packages/frontend/src/app/threads/api/threads/search/route.ts` | GET | 公開GET / search系 | 不要 | GETのため対象外 | 必須 |
| `/threads/api/threads/setThreadLike` | `packages/frontend/src/app/threads/api/threads/setThreadLike/route.ts` | POST | unsafe method / リアクション系 | backendで必須 | 対象 | 必須 |
| `/threads/api/users/players` | `packages/frontend/src/app/threads/api/users/players/route.ts` | GET | 公開GET / search系 | 不要 | GETのため対象外 | 必須 |
| `/threads/api/users/updateProfile` | `packages/frontend/src/app/threads/api/users/updateProfile/route.ts` | PATCH/PUT | unsafe method / upload系 | backendで必須 | 対象 | 必須 |

## Frontend Server Fetches Without Matching Route Handler

- `packages/frontend/src/app/threads/lib/getThread.ts`
  - Backend `/bbs/threads` を直接BFF fetchします。
  - 分類: 公開GET、任意session参照、backend internal auth必須。
- `packages/frontend/src/app/threads/lib/getThreadById.ts`
  - Backend `/bbs/threads/{id}` を直接BFF fetchします。
  - 分類: 公開GET、任意session参照、backend internal auth必須。
- `packages/frontend/src/app/threads/lib/searchThreads.ts`
  - Backend `/bbs/threads/search` を直接BFF fetchします。
  - 分類: 公開GET、search系、backend internal auth必須。

## Backend Hono Route Classification

| Route | 実体 | Method | 分類 | 認証 | internal auth |
| --- | --- | --- | --- | --- | --- |
| `/better-auth` / `/better-auth/*` | `packages/backend/src/routes/better-auth-handler.ts` | ALL | auth系 | better-auth側に委譲 | なし |
| `/bbs/media/upload` | `packages/backend/src/routes/bbs/media/methods/upload.ts` | POST | unsafe method / upload系 | 必須 | 必須 |
| `/bbs/posts/create` | `packages/backend/src/routes/bbs/posts/methods/create.ts` | POST | unsafe method / 投稿・作成系 / realtime publish | 必須 | 必須 |
| `/bbs/posts/byThreadId/{threadId}` | `packages/backend/src/routes/bbs/posts/methods/get.ts` | GET | 公開GET | 任意session参照のみ | 必須 |
| `/bbs/posts/reactions/available` | `packages/backend/src/routes/bbs/posts/methods/reactions.ts` | GET | 公開GET / リアクション系 | 不要 | 必須 |
| `/bbs/posts/reactions/set` | `packages/backend/src/routes/bbs/posts/methods/reactions.ts` | POST | unsafe method / リアクション系 | 必須 | 必須 |
| `/bbs/threads` | `packages/backend/src/routes/bbs/threads/methods/get.ts` | GET | 公開GET | 任意session参照のみ | 必須 |
| `/bbs/threads/{id}` | `packages/backend/src/routes/bbs/threads/methods/get.ts` | GET | 公開GET | 任意session参照のみ | 必須 |
| `/bbs/threads/search` | `packages/backend/src/routes/bbs/threads/methods/get.ts` | GET | 公開GET / search系 | 任意session参照のみ | 必須 |
| `/bbs/threads/trending` | `packages/backend/src/routes/bbs/threads/methods/get.ts` | GET | 公開GET | 任意session参照のみ | 必須 |
| `/bbs/threads/create` | `packages/backend/src/routes/bbs/threads/methods/create.ts` | POST | unsafe method / 投稿・作成系 | 必須 | 必須 |
| `/bbs/threads/likes/set` | `packages/backend/src/routes/bbs/threads/methods/likes.ts` | POST | unsafe method / リアクション系 | 必須 | 必須 |
| `/bbs/users/update` | `packages/backend/src/routes/bbs/users/methods/update.ts` | PATCH | unsafe method / upload系 | 必須 | 必須 |
| `/bbs/users/{id}` | `packages/backend/src/routes/bbs/users/methods/get.ts` | GET | 公開GET | 不要 | 必須 |
| `/bbs/users/players` | `packages/backend/src/routes/bbs/users/methods/players.ts` | GET | 公開GET / search系 | 不要 | 必須 |
| `/bbs/notifications` | `packages/backend/src/routes/bbs/notifications/methods/get.ts` | GET | 認証必須GET / notifications系 | 必須 | 必須 |
| `/bbs/notifications/count` | `packages/backend/src/routes/bbs/notifications/methods/count.ts` | GET | 認証必須GET / notifications系 | 必須 | 必須 |
| `/bbs/notifications/read-all` | `packages/backend/src/routes/bbs/notifications/methods/read-all.ts` | POST | unsafe method / notifications系 | 必須 | 必須 |
| `/bbs/realtime/threads/:threadId/ws` | `packages/backend/src/routes/bbs/realtime/index.ts` | GET WebSocket upgrade | realtime系 | 不要 | 例外 |

## Upload Baseline

- `bbs/media/upload`
  - 認証必須です。
  - 8MB上限です。
  - MIME typeは `jpeg` / `png` / `webp` / `avif` のみです。
  - SVGは許可していません。
  - R2 keyはサーバー側固定prefixと `crypto.randomUUID()` で生成されます。
  - userId単位で1分20回のupload制限があります。
- `bbs/users/update`
  - 認証必須です。
  - avatarは2MB、header imageは6MB上限です。
  - 2026-05-04時点では `image/svg+xml` を許可しています。
  - R2 keyはサーバー側固定prefixと `crypto.randomUUID()` で生成されます。

## IP Resolver Baseline

- `packages/shared/src/utils/request/getClientIp.ts` を追加済みです。
- `CF-Connecting-IP` を優先します。
- `True-Client-IP` は `CF-Connecting-IP` がない場合に使います。
- `X-Forwarded-For` はクライアントが偽装できる可能性があるため、最後のフォールバックとして扱います。
- IPが取れない場合は `unknown` を返します。

## Initial Risks

- `bbs/users/update` はSVGを許可しています。サニタイズ処理は確認できていません。
- realtime WebSocketは未認証で、接続数制限とrate limitは未確認です。
- `better-auth-handler.ts` は `origin` を毎回 `console.log` しています。
- search系はbackend側で `limit` 上限がありますが、`/bbs/threads/search` は上限が未設定です。

## Acceptance Criteria

- 指定ルートについて、実体の有無と分類が明記されていること。
- 推測した分類を含めないこと。
- 未確認または実体なしは「不明」または「実体なし」と明記されていること。
