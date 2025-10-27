import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const page = url.searchParams.get("page") ?? "1";

	const res = await getAllThreads(Number(page));
	return NextResponse.json(res);
}

async function getAllThreads(page: number) {
	type resType = InferResponseType<typeof client.bbs.threads.$get>;
	return BffFetcher<resType>(`${getApiUrl("GET_ALL_THREADS")}?page=${page}`, {
		method: "GET",
	});
}
