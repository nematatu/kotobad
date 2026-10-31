# Runtime test policy

## 目的

ビルド成功と型チェック成功を、実際の動作確認と混同しないための検証基準です。

## 完了判定

- TypeScriptの型チェックは、型整合性の確認です。HTTPレスポンス、cookie属性、middlewareの分岐、外部連携の動作は保証しません。
- Buildは、コンパイルとパッケージングの確認です。runtime testの代わりにはなりません。
- Route Handlerやmiddlewareを変更した場合は、実際の`Request`を渡すruntime testを追加します。
- セキュリティ変更では、成功ケースだけでなく、欠落・不一致・許可外入力の拒否ケースもテストします。
- Browser、BFF、Backendをまたぐ挙動は、Route Handler単体テストだけでは保証できません。E2Eがない場合は「未確認」と報告します。

## 現在の適用例

- Backend: `packages/backend/src/middleware/csrf-origin.test.ts`
  - Hono middlewareへ実際のPOST requestを渡し、valid tokenが通ること、token欠落が403になることを確認します。
- Backend: `packages/backend/src/utils/isAllowedOrigin.test.ts`
  - 設定済みOrigin、`demo.kotobad.com`、CloudflareプレビューURLの許可と許可外Originの拒否を確認します。
- Frontend: `packages/frontend/src/app/threads/api/csrf-token/route.test.ts`
  - Route Handlerを実際に呼び、`Set-Cookie`の`Secure`、`HttpOnly`、`SameSite`、`Path`、`Max-Age`を確認します。
- Frontend: `packages/frontend/src/app/auth/api/demo-login/route.test.ts`
  - GETの405拒否、POSTでのデモユーザーサインイン成功、ユーザー未作成時のサインアップ自動フォールバック、Cookie転送を確認します。
- Frontend: `packages/frontend/src/lib/auth/demoMode.test.ts`
  - URLクエリ `demo=true` / `demo=1` / `demo` での有効化、`demo=false` での無効化、`sessionStorage` への永続化、`demo.` ホスト名判定を確認します。
- Frontend: `packages/frontend/src/app/bwf-live-demo/lib/*.test.ts`
  - 日本人選手名マッピング（漢字変換・判定）、ラウンドやコートの和名変換、デモスコアの更新ステップ実行を確認します。
- root: `bun run test`
  - BackendとFrontendの両方のruntime testを実行します。
- CI: `.github/workflows/ci.yml`
  - `Run runtime tests (Backend + Frontend)`でrootのtest scriptを実行した後に、typecheck、Biome、Backend build、Frontend buildを実行します。

## 報告時の必須区分

実行結果は、次の3つを分けて記載します。

1. runtime testで確認できたこと
2. typecheck/buildだけで確認できたこと
3. 未確認の範囲（特にBrowser E2E、外部サービス、本番Cloudflare設定）
