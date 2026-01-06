import { TagListSchema } from "@kotobad/shared/src/schemas/tag";
import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

export const revalidate = 300;

export async function GET() {
	try {
		const res = await getAllTags();
		return NextResponse.json(res, {
			headers: {
				"Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}`,
			},
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			let payload: Record<string, unknown> = { error: "Tags not found" };
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "tags not found" };
				}
			}
			return NextResponse.json(payload, { status: 404 });
		}

		console.error("Failed to fetch thread via BFF", fetchError);
		return NextResponse.json(
			{ error: "Failed to fetch tags" },
			{ status: fetchError.status ?? 500 },
		);
	}
}

async function getAllTags() {
	type resType = InferResponseType<typeof client.tags.$get>;
	const url = await getApiUrl("GET_ALL_TAGS");
	const res = await BffFetcher<resType>(url, {
		method: "GET",
		cache: "force-cache",
		skipCookie: true,
	});
	return TagListSchema.parse(res);
}
