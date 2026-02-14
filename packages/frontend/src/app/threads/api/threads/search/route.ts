import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadListType } from "@kotobad/shared/src/types/thread";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const query = url.searchParams.get("q")?.trim();
	const page = url.searchParams.get("page") ?? "1";
	const limit = url.searchParams.get("limit") ?? "20";

	if (!query) {
		return NextResponse.json(
			{ error: "Query parameter 'q' is required" },
			{ status: 400 },
		);
	}

	try {
		const raw = await searchThreads(query, Number(page), Number(limit));
		const res = ThreadListSchema.parse(raw);
		return NextResponse.json(res, {
			headers: {
				"Cache-Control": "no-store",
			},
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		console.error("Failed to fetch thread search via BFF", fetchError);
		return NextResponse.json(
			{ error: "Failed to fetch thread search" },
			{ status: fetchError.status ?? 500 },
		);
	}
}

async function searchThreads(query: string, page: number, limit: number) {
	const url = await getApiUrl("SEARCH_THREADS");
	url.searchParams.set("q", query);
	url.searchParams.set("page", String(page));
	url.searchParams.set("limit", String(limit));

	const raw = await BffFetcher<ThreadListType>(url, {
		method: "GET",
		cache: "no-store",
		skipCookie: true,
	});
	return ThreadListSchema.parse(raw);
}
