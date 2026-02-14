import "server-only";
import { TagListSchema } from "@kotobad/shared/src/schemas/tag";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function getTags(): Promise<TagListType> {
	const targetUrl = await getApiUrl("GET_ALL_TAGS");
	let raw: TagListType;

	try {
		raw = await BffFetcher<TagListType>(targetUrl, {
			method: "GET",
			cache: "no-store",
			skipCookie: true,
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch tags", fetchError);
		return [];
	}

	const parsed = TagListSchema.safeParse(raw);
	if (!parsed.success) {
		return [];
	}
	return parsed.data;
}
