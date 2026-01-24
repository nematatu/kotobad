import "server-only";
import { TagListSchema } from "@kotobad/shared/src/schemas/tag";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { InferResponseType } from "hono";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";
import { REVALIDATE_SECONDS } from "@/lib/const/revalidate-time";

export async function getTags(): Promise<TagListType> {
	const targetUrl = await getApiUrl("GET_ALL_TAGS");
	type ResType = InferResponseType<typeof client.tags.$get>;
	let raw: unknown;

	try {
		raw = await BffFetcher<ResType>(targetUrl, {
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
		return [];
	}

	const parsed = TagListSchema.safeParse(raw);
	if (!parsed.success) {
		return [];
	}
	return parsed.data;
}
