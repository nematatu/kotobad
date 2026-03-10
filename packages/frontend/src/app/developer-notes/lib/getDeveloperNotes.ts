import "server-only";
import { DeveloperNoteListSchema } from "@kotobad/shared/src/schemas/developerNote";
import type { DeveloperNoteListType } from "@kotobad/shared/src/types/developerNote";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

const MOCK_DEVELOPER_NOTE_RESPONSE: DeveloperNoteListType = {
	notes: [
		{
			id: 1003,
			content:
				"検索結果カードの情報密度をもう少し上げたいです。タイトルまわりの余白を削りつつ、タグの見え方も整理したいです。",
			createdAt: "2026-03-10T10:20:00.000Z",
			updatedAt: null,
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
	const targetUrl = await getApiUrl("GET_ALL_DEVELOPER_NOTES");

	try {
		const raw = await BffFetcher<DeveloperNoteListType>(targetUrl, {
			method: "GET",
			cache: "no-store",
		});
		return DeveloperNoteListSchema.parse(raw);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch developer notes", fetchError);
		return DeveloperNoteListSchema.parse(MOCK_DEVELOPER_NOTE_RESPONSE);
	}
}
