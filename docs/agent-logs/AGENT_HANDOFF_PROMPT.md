# AI引き継ぎログ生成プロンプト（テンプレート）

目的: 直近セッションの全体像・意図・変更点・未解決課題を、次のAIが即座に理解できる形で記録する。

## 使い方
1) セッション終了時に、下の「プロンプト」をAIに渡す。
2) 出力を `docs/agent-logs/YYYY-MM-DD-<session-id>/README.md` に保存する。
3) 重要ログ（エラー/ビルド/実行/デプロイ）は同ディレクトリに `logs/` を作って貼り付ける。

---

## プロンプト（そのまま使用）

以下を厳密に満たす引き継ぎログを作成してください。人間向けではなくAI向けに最適化し、網羅性と再現性を優先してください。

- 目的: 次のAIが「このログだけ」で状況を完全に再現できること。
- 必須: プロダクト概要 / 現在の目標 / 変更点（ファイル単位） / 未解決課題 / 実行コマンド / エラーとログ / 重要な判断理由 / 制約（ユーザー要求・禁止事項）。
- 形式: 見出し付きMarkdown。短文・箇条書き中心。時系列も含める。
- 具体性: パス、関数名、キー名、環境変数、外部サービス名を明記する。
- 省略禁止: 会話で出た仮説・否定された案も「不採用」として記録する。

出力先: docs/agent-logs/YYYY-MM-DD-<session-id>/README.md

## セクション例
- Summary
- Product Overview
- Current Goal
- Changes (by file)
- Commands Run
- Errors & Logs (quoted)
- Decisions & Rationale
- Open Issues / Next Steps
- User Constraints

