import { UserProfileSchema } from "@kotobad/shared/src/schemas/user";
import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function getUserProfileById(id: string): Promise<UserProfileType> {
	const baseUrl = await getApiUrl("GET_USER_PROFILE_BY_ID");
	const targetUrl = new URL(encodeURIComponent(id), baseUrl);
	const raw = await BffFetcher<unknown>(targetUrl, {
		method: "GET",
		cache: "no-store",
		skipCookie: true,
	});
	return UserProfileSchema.parse(raw);
}
