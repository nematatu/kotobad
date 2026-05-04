import {
	SetThreadLikesResponseSchema,
	SetThreadLikesSchema,
} from "@kotobad/shared/src/schemas/thread";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { checkFrontendRateLimit } from "@/lib/api/security/frontendRateLimit";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const rateLimitResponse = checkFrontendRateLimit(req, "reaction");
	if (rateLimitResponse) return rateLimitResponse;

	try {
		const json = await req.json();
		const value = SetThreadLikesSchema.parse(json);
		const raw = await setThreadLike(value);
		const response = SetThreadLikesResponseSchema.parse(raw);

		return NextResponse.json(response);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to set thread like",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to set thread like" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to set thread like via BFF", error);
		return NextResponse.json(
			{ error: "Failed to set thread like" },
			{ status: 500 },
		);
	}
}

async function setThreadLike(values: z.infer<typeof SetThreadLikesSchema>) {
	const url = await getApiUrl("SET_THREAD_LIKES");
	return BffFetcher<z.infer<typeof SetThreadLikesResponseSchema>>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
