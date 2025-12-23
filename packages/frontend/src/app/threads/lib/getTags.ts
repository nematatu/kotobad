import "server-only";
import { TagListSchema } from "@kotobad/shared/src/schemas/tag";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import { REVALIDATE_SECONDS } from "@/lib/const/revalidate-time";

export async function getTags(): Promise<TagListType | undefined> {
	const targetUrl = await getApiUrl("GET_ALL_TAGS");

	let raw: unknown;
	try {
		raw = await BffFetcher<unknown>(targetUrl, {
			method: "GET",
			cache: "force-cache",
			next: { revalidate: REVALIDATE_SECONDS, tags: ["tags"] },
			skipCookie: true,
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch tags", fetchError);
	}

	if (!Array.isArray(raw)) {
		return undefined;
	}

	const parsed = TagListSchema.safeParse(raw);
	if (!parsed.success) {
		return undefined;
	}
	return parsed.data;
}
