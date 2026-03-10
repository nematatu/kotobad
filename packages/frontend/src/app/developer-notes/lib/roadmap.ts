import type { DeveloperNoteStatusType } from "@kotobad/shared/src/types/developerNote";

export const DEVELOPER_NOTE_ROADMAP_ITEMS: Array<{
	title: string;
	summary: string;
	status: DeveloperNoteStatusType;
}> = [
	{
		title: "検索結果の情報密度",
		summary:
			"タイトルとタグの見え方を再調整して、探したい話題へ早く届く形に寄せています。",
		status: "wip",
	},
	{
		title: "ボヤキページの運用",
		summary:
			"ロードマップと作業ログを分けつつ、雑感も追えるように表示の軸を整理しています。",
		status: "wip",
	},
	{
		title: "通知導線の見直し",
		summary: "どこで更新に気づけるかを整理して、迷わず追えるようにしたいです。",
		status: "todo",
	},
	{
		title: "モバイル遷移の改善",
		summary:
			"タップ後の気持ちよさと、情報の切り替わり方を細かく詰める予定です。",
		status: "todo",
	},
	{
		title: "Markdown 詳細ページ",
		summary:
			"画像や GIF を置ける土台を先に整え、更新ごとの説明を書きやすくしました。",
		status: "done",
	},
	{
		title: "開発タイムライン",
		summary:
			"進捗メモを changelog のように積み上げる見た目と基本導線を用意しました。",
		status: "done",
	},
];
