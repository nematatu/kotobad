import { TagListSchema } from "@kotobad/shared/src/schemas/tag";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

export async function getTags(): Promise<TagListType> {
	const targetUrl = await getBffApiUrl("GET_ALL_TAGS");

	let raw: TagListType = [];
	try {
		raw = await BffFetcher<TagListType>(targetUrl, {
			method: "GET",
			skipCookie: true,
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch threads", fetchError);
	}

	const safeResponse = Array.isArray(raw) ? raw : [];
	const TagsResponse: TagListType = TagListSchema.parse(safeResponse);

	return TagsResponse;
}
