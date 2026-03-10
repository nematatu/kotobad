import "server-only";
import { DeveloperRoadmapListSchema } from "@kotobad/shared/src/schemas/developerRoadmap";
import type { DeveloperRoadmapListType } from "@kotobad/shared/src/types/developerRoadmap";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import { MOCK_DEVELOPER_ROADMAP_ITEMS } from "./roadmap";

export async function getDeveloperRoadmap(): Promise<DeveloperRoadmapListType> {
	const targetUrl = await getApiUrl("GET_ALL_DEVELOPER_ROADMAP");

	try {
		const raw = await BffFetcher<DeveloperRoadmapListType>(targetUrl, {
			method: "GET",
			cache: "no-store",
			skipCookie: true,
		});
		return DeveloperRoadmapListSchema.parse(raw);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch developer roadmap", fetchError);
		return DeveloperRoadmapListSchema.parse(MOCK_DEVELOPER_ROADMAP_ITEMS);
	}
}
