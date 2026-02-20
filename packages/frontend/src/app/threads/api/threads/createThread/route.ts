import {
	CreateThreadSchema,
	ThreadSchema,
} from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const value = CreateThreadSchema.parse(json);
		const raw = await createThread(value);
		const thread = ThreadSchema.parse(raw);

		revalidateTag("threads");
		revalidateTag(`thread:${thread.id}`);
		return NextResponse.json(thread);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to create thread",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to create thread" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to create thread via BFF", error);
		return NextResponse.json(
			{ error: "Failed to create thread" },
			{ status: 500 },
		);
	}
}

async function createThread(values: ThreadType.CreateThreadType) {
	const url = await getApiUrl("CREATE_THREAD");
	return BffFetcher<ThreadType.ThreadType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
