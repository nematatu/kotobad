---
theme: default
title: kotobad — バドミントン掲示板
class: text-center
transition: fade
mdc: true
style: |
  :root { --slidev-theme-primary: #60a5fa; }
  h1 { font-size: 4rem !important; font-weight: 900 !important; line-height: 1.05 !important; }
  h2 { font-size: 2.6rem !important; font-weight: 800 !important; line-height: 1.1 !important; }
  p, li { font-size: 1.8rem !important; line-height: 1.5 !important; }
  .lead { font-size: 2.2rem !important; }
  section { padding: 2.5rem 3.5rem !important; }
  .big { font-size: 5rem !important; font-weight: 900; color: #60a5fa; line-height: 1; }
  .invert { background: #f1f5f9 !important; color: #0b1220 !important; }
  .invert p, .invert li { color: #334155 !important; }
  .invert .big { color: #1d4ed8 !important; }
---

# kotobad

バドミントン特化の掲示板 Web サイト

交流の場に、試合通知とライブスコアを足した

<div class="mt-6 flex gap-3 justify-center flex-wrap">
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">技育展2026 オンライン予選</span>
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">チーム 劇団ひとり</span>
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">tatu</span>
</div>

<div class="abs-br m-6">
  <img src="./assets/logo.svg" class="w-16 h-16" />
</div>

---
layout: center
class: text-center invert
---

# バドミントンは、マイナースポーツ

## 専用の交流の場がない

<img src="./assets/home.png" class="mx-auto rounded-xl max-h-64 mt-4" />

---
layout: center
class: text-center invert
---

# 情報が、あちこちに散らばる

- SNS やチャットに会話が分散
- 試合の通知や結果を追う手段が乏しい
- コミュニティが盛り上がりにくい

---

# kotobad が解決する

## 掲示板 × 試合通知 × ライブスコア

<img src="./assets/thread-detail.png" class="mx-auto rounded-xl max-h-64 mt-4" />

---

# 主な機能

<div class="grid grid-cols-2 gap-5 mt-4">
<div class="p-5 rounded-xl border">

### 掲示板

ユーザーがスレッドを立てて会話

</div>
<div class="p-5 rounded-xl border">

### 自動スレッド

試合ごとに自動生成、ライブチャット

</div>
<div class="p-5 rounded-xl border">

### 試合通知

気になる試合の通知を受け取る

</div>
<div class="p-5 rounded-xl border">

### ライブスコア

進行中の点数をリアルタイム表示

</div>
</div>

---
layout: center
class: text-center
---

# 実際の画面: スレッド一覧

<img src="./assets/threads-list.png" class="mx-auto rounded-xl max-h-80" />

---
layout: center
class: text-center
---

# 実際の画面: スレッド詳細

<img src="./assets/thread-detail.png" class="mx-auto rounded-xl max-h-80" />

---

# ユーザー体験にこだわる

- PWA 対応、ホーム画面から起動
- クリック時のローディングアニメーション
- モバイル最適化のナビゲーション
- プルトゥリフレッシュ

<img src="./assets/notifications.png" class="mx-auto rounded-xl max-h-44 mt-2" />

---

# 使用技術

<div class="grid grid-cols-6 gap-4 mt-4 text-center">
<div><img src="./assets/nextjs.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Next.js 16</div></div>
<div><img src="./assets/react.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">React 19</div></div>
<div><img src="./assets/typescript.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">TypeScript</div></div>
<div><img src="./assets/hono.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Hono</div></div>
<div><img src="./assets/cloudflare.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Cloudflare</div></div>
<div><img src="./assets/zod.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Zod</div></div>
<div><img src="./assets/drizzle.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Drizzle</div></div>
<div><img src="./assets/bun.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Bun</div></div>
<div><img src="./assets/radix.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Radix UI</div></div>
<div><img src="./assets/tailwind.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Tailwind</div></div>
<div><img src="./assets/google.svg" class="w-14 h-14 mx-auto" /><div class="text-sm mt-1">Google OAuth</div></div>
</div>

<p class="mt-4 text-lg opacity-70">フロントエンド: Next.js / バックエンド: Hono / DB: Cloudflare D1 / 保存: R2</p>

---
layout: center
class: text-center
---

# システム構成

```mermaid
flowchart LR
    U[ユーザー / PWA] --> FE[Next.js 16]
    U --> BFF[Next.js BFF]
    BFF -->|Cookie + HMAC| BE[Hono Backend]
    FE -->|Server fetch + HMAC| BE
    BE -->|Drizzle| D1[(D1)]
    BE --> R2[(R2)]
    U -->|WebSocket| BE
    BE --> DO[ThreadRoom DO]
    DO -->|post.created| U
```

---

# リアルタイム: WebSocket + Durable Objects

- Thread 単位の Durable Object が socket を集約
- 新規投稿時に post.created を通知
- 通知を受けたら SWR で D1 の正本を再取得
- WebSocket は変更通知、HTTP は正本取得

<img src="./assets/bwf-live-demo.png" class="mx-auto rounded-xl max-h-44 mt-2" />

---

# 型安全: 共有 Zod スキーマ

- Frontend と Backend で同じ Zod を共有
- Validation、OpenAPI、TypeScript 型、Response 検証を一つの契約から
- HTTP 境界の runtime data を検査

<div class="grid grid-cols-2 gap-4 mt-4">
<div class="p-4 rounded-xl border text-lg">Shared Zod<br /><span class="opacity-60 text-base">Thread / Post / User / Notification / Tag / Media / Reaction / Error</span></div>
<div class="p-4 rounded-xl border text-lg">Hono Backend<br /><span class="opacity-60 text-base">createRoute + RouteHandler&lt;typeof route&gt;</span></div>
</div>

---

# キャッシュと静的アセット保護

- ライブデータは no-store、タグは 5 分、静的は 1 年 immutable
- iOS で古い CSS が削除済み woff2 を要求し 404 連発した障害
- R2 スナップショットで前回参照 asset を検査
- 欠落時は本番 origin から復旧、復旧不能なら build 失敗

---
layout: center
class: text-center invert
---

<div class="big">18</div>

# OpenAPI 登録 API

<div class="big mt-2">48</div>

## テスト (37+11)

---

# セキュリティへのこだわり

- AI に一任せず、XSS / CSRF を自分の目で確認
- ペネトレーションテストを実施
- HMAC + CSRF + Origin の多層防御

---
layout: center
class: text-center invert
---

# データベース設計

- Cloudflare D1 + Drizzle ORM
- threads / posts / tags / reactions / notifications
- (threadId, localId) の unique 制約で採番競合を防ぐ
- 最大 3 回リトライ

<img src="./assets/search.png" class="mx-auto rounded-xl max-h-40 mt-2" />

---
layout: center
class: text-center invert
---

# 地味なこだわり

<div class="flex gap-6 justify-center mt-2">
  <img src="./assets/logo-moji.svg" class="max-h-20" />
  <img src="./assets/pwa-icon.png" class="w-20 h-20" />
</div>

- ロゴ (文字とアイコン) を自作
- PWA 対応、プルトゥリフレッシュ、ボトムナビ
- Safe area、Reduced motion 対応

---

# 今後の展望

- モバイルネイティブアプリの開発
- オフライン対応の強化
- Web Push 通知
- コミュニティの拡大

<img src="./assets/ogp.png" class="mx-auto rounded-xl max-h-44 mt-2" />

---
layout: center
class: text-center invert
---

# まとめ

- バドミントン特化の掲示板 + 試合通知 + ライブスコア
- Cloudflare 上に集約したフルスタック構成
- リアルタイム通知と型安全な API 契約
- UX とセキュリティへのこだわり

<div class="mt-4 flex gap-3 justify-center flex-wrap">
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">kotobad.com</span>
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">github.com/nematatu/kotobad</span>
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">youtube.com/watch?v=Hrrha3mdc2s</span>
</div>

---
layout: center
class: text-center invert
---

# ありがとうございました

ご質問をお待ちしています

<div class="mt-6 flex gap-3 justify-center flex-wrap">
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">kotobad.com</span>
  <span class="px-4 py-2 rounded-full border text-lg opacity-70">github.com/nematatu/kotobad</span>
</div>

<div class="abs-br m-6">
  <img src="./assets/logo.svg" class="w-16 h-16" />
</div>
