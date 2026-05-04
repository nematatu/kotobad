import { PostListSchema } from "@kotobad/shared/src/schemas/post";
import type { PostListType } from "@kotobad/shared/src/types/post";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { getApiUrl } from "@/lib/config/apiUrls";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: Params) {
	const rateLimitResponse = checkFrontendRateLimit(req, "read");
	if (rateLimitResponse) return rateLimitResponse;

	const renderedparams = await params;
	const { id } = renderedparams;

	try {
		const res = await getPostByThreadId(id);
		return NextResponse.json(res);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			let payload: Record<string, unknown> = { error: "Posts not found" };
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Posts not found" };
				}
			}
			return NextResponse.json(payload, { status: 404 });
		}

		console.error("Failed to fetch posts via BFF", fetchError);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: fetchError.status ?? 500 },
		);
	}
}

async function getPostByThreadId(threadId: string): Promise<PostListType> {
	const baseUrl = await getApiUrl("GET_POSTS_BY_THREADID");
	const targetUrl = new URL(threadId, baseUrl);
	const raw = await BffFetcher<PostListType>(targetUrl, {
		method: "GET",
	});
	return PostListSchema.parse(raw);
}
