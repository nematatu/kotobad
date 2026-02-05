# AI引き継ぎログ テンプレート

目的: 次のAIがこのログだけで状況を再現できることを優先する。

必須項目:
- プロダクト概要
- 現在の目標
- 変更点（ファイル単位）
- 未解決課題
- 実行コマンド
- エラーとログ
- 重要な判断理由
- 制約（ユーザー要求・禁止事項）

形式:
- 見出し付きMarkdown
- 短文・箇条書き中心
- 時系列を含める
- パス、関数名、キー名、環境変数、外部サービス名を明記する
- 仮説や否定された案も「不採用」として記録する

出力先:
- `docs/agent-logs/YYYY-MM-DD-<session-id>/README.md`
- 重要ログは `docs/agent-logs/YYYY-MM-DD-<session-id>/logs/`

---

## Summary

- 目的と結果を1〜3行でまとめる。

## Product Overview

- プロダクト名
- 概要
- 主機能
- 主目的

## Current Goal

- 現在の作業目標と達成状況

## Changes (by file)

- `path/to/file`: 変更内容

## Commands Run

- `command --flags`

## Errors & Logs

```
<raw log>
```

## Decisions & Rationale

- 判断内容と理由
- 不採用: <案> / <理由>

## Open Issues / Next Steps

- 未解決の課題
- 次の具体的なアクション

## User Constraints

- ユーザーの要求や禁止事項
