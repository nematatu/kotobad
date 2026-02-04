import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
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
		const res = await searchThreads(query, Number(page), Number(limit));
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
	type ResType = InferResponseType<typeof client.bbs.threads.search.$get>;
	const url = await getApiUrl("SEARCH_THREADS");
	url.searchParams.set("q", query);
	url.searchParams.set("page", String(page));
	url.searchParams.set("limit", String(limit));

	return BffFetcher<ResType>(url, {
		method: "GET",
		cache: "no-store",
		skipCookie: true,
	});
}
