import { NextResponse } from "next/server";
import { getThreadWithPosts } from "@/app/threads/lib/getThreadWithPosts";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";

export const dynamic = "force-dynamic";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: Params) {
	const renderedparams = await params;
	const { id } = renderedparams;

	try {
		const res = await getThreadWithPosts(id);
		return NextResponse.json(res, {
			headers: {
				"Cache-Control": "no-store",
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
