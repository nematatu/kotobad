import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { ReactionOptionType } from "@kotobad/shared/src/types/reaction";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function GET(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "read");
	if (rateLimitResponse) return rateLimitResponse;

	const raw = await getReactionOptions();
	const response = ReactionOptionListSchema.parse(raw);
	return NextResponse.json(response);
}

async function getReactionOptions(): Promise<ReactionOptionType[]> {
	const url = await getApiUrl("GET_REACTION_OPTIONS");
	return BffFetcher<ReactionOptionType[]>(url, {
		method: "GET",
		credentials: "include",
	});
}
