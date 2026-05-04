import { CreatePostSchema, PostSchema } from "@kotobad/shared/src/schemas/post";
import type { PostType } from "@kotobad/shared/src/types";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import {
	getTurnstileTokenFromJson,
	verifyTurnstileToken,
} from "@/lib/api/security/turnstile";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "createPost");
	if (rateLimitResponse) return rateLimitResponse;

	try {
		const json = await req.json();
		const turnstileResponse = await verifyTurnstileToken({
			req,
			scope: "createPost",
			token: getTurnstileTokenFromJson(json),
		});
		if (turnstileResponse) return turnstileResponse;

		const value = CreatePostSchema.parse(json);
		const raw = await createPost(value);
		const post = PostSchema.parse(raw);

		revalidateTag("threads", "max");
		revalidateTag(`thread:${value.threadId}`, "max");
		return NextResponse.json(post);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = { error: "Failed to create post" };
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to create post" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to create post via BFF", error);
		return NextResponse.json(
			{ error: "Failed to create post" },
			{ status: 500 },
		);
	}
}

async function createPost(values: PostType.CreatePostType) {
	const url = await getApiUrl("CREATE_POST");
	return BffFetcher<PostType.PostType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
