# Summary

- 2026-02-05 時点の引き継ぎ。
- 事実の未確認断定が発生したため、AGENTS.md に厳格な正確性ルールを追加した。
- ThreadList は JS ではなく疑似要素でカード全体リンク化する方式に寄せた。

## Product Overview

- プロダクト名: kotobad
- 概要: バドミントン向けの掲示板サイト
- 主機能: スレッド作成/閲覧、投稿
- 主目的: コミュニティの情報共有

## Current Goal

- 反省と再発防止の文書化を実施。
- 次のAIが同様の誤りを回避できる状態にする。

## Changes (by file)

- `AGENTS.md`: 正確性・検証・二重チェックの必須化と、最重要事項としての明記を追加。
- `packages/frontend/src/app/threads/components/view/ThreadList.tsx`: `::after` を使った stretched link パターンに変更し、カード全体をリンクとして扱う構成に調整。

## Commands Run

- 本質的な再現に不要なため、省略。

## Errors & Logs

```
rg: /Users/nematatu/Library/... Operation not permitted (os error 1)
```

## Decisions & Rationale

- 反省と再発防止を明文化するため、AGENTS.md に厳格な確認手順を追記した。
- 不採用: JS でカード全体のクリックを処理する案 / 理由: ユーザーが重い処理と感じるため。
- 不採用: カード全体を <a> で包み、内部に <a> を配置する案 / 理由: HTML仕様上の不適合の懸念（未検証）。

## Open Issues / Next Steps

- PC 全体で参照される AGENTS.md のパスが未確認。パスの提示が必要。
- ユーザーページの正しい URL (`/users/:id` など) が未確認。
- 未コミット差分: `packages/frontend/src/app/threads/[id]/components/PostList.tsx`, `packages/frontend/src/assets/threads/chat.svg`, `packages/shared/src/utils/date/getRelativeDate.ts`。本ログの変更かどうか未確認。

## User Constraints

- 丁寧な日本語で回答。
- 未確認の断定禁止。検証できない場合は「不明/未確認」を明記。
- ドキュメント全件確認が必須。
- migrations/生SQLの禁止。
- `package.json` の無関係な整形禁止。
- 強制型キャスト禁止。
