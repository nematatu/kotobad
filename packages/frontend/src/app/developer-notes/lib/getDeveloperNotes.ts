import "server-only";
import { DeveloperNoteListSchema } from "@kotobad/shared/src/schemas/developerNote";
import type { DeveloperNoteListType } from "@kotobad/shared/src/types/developerNote";

const MOCK_DEVELOPER_NOTE_RESPONSE: DeveloperNoteListType = {
	notes: [
		{
			id: 1003,
			content:
				"検索結果カードの情報密度をもう少し上げたいです。タイトルまわりの余白を削りつつ、タグの見え方も整理したいです。",
			status: "todo",
			kind: "log",
			createdAt: "2026-03-10T10:20:00.000Z",
			updatedAt: null,
			authorId: "developer-mock",
			author: {
				name: "ねま",
				image: null,
			},
		},
		{
			id: 1002,
			content:
				"開発者のボヤキページのタイムラインUIを実装中です。モバイルでの読みやすさを見ながら、フォームの置き方を調整しています。",
			status: "wip",
			kind: "log",
			createdAt: "2026-03-10T08:45:00.000Z",
			updatedAt: null,
			authorId: "developer-mock",
			author: {
				name: "ねま",
				image: null,
			},
		},
		{
			id: 1001,
			content:
				"changelog っぽい見せ方は好きですが、開発者の温度感も少しだけ残したいので、雑感だけ拾える見え方は残したいです。",
			status: "wip",
			kind: "note",
			createdAt: "2026-03-10T07:15:00.000Z",
			updatedAt: null,
			authorId: "developer-mock",
			author: {
				name: "ねま",
				image: null,
			},
		},
		{
			id: 1000,
			content:
				"更新情報詳細を Markdown で持てるように切り替えました。画像や GIF を置ける土台は一旦できています。",
			status: "done",
			kind: "log",
			createdAt: "2026-03-09T15:10:00.000Z",
			updatedAt: "2026-03-09T16:00:00.000Z",
			authorId: "developer-mock",
			author: {
				name: "ねま",
				image: null,
			},
		},
	],
	canCreate: false,
};

export async function getDeveloperNotes(): Promise<DeveloperNoteListType> {
	return DeveloperNoteListSchema.parse(MOCK_DEVELOPER_NOTE_RESPONSE);
}
