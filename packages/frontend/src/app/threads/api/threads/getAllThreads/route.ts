import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

// API 応答自体も短期キャッシュして初回以外の負荷を下げる
export const revalidate = 900;

export async function GET(req: Request) {
	const url = new URL(req.url);
	const page = url.searchParams.get("page") ?? "1";

	try {
		const res = await getAllThreads(Number(page));
		return NextResponse.json(res, {
			headers: {
				"Cache-Control": "public, s-maxage=900, stale-while-revalidate=900",
			},
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			let payload: Record<string, unknown> = { error: "Thread not found" };
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Thread not found" };
				}
			}
			return NextResponse.json(payload, { status: 404 });
		}

		console.error("Failed to fetch thread via BFF", fetchError);
		return NextResponse.json(
			{ error: "Failed to fetch thread" },
			{ status: fetchError.status ?? 500 },
		);
	}
}

async function getAllThreads(page: number) {
	type resType = InferResponseType<typeof client.bbs.threads.$get>;
	const url = await getApiUrl("GET_ALL_THREADS");
	url.searchParams.set("page", String(page));
	return BffFetcher<resType>(url, {
		method: "GET",
		cache: "force-cache",
		skipCookie: true,
	});
}
