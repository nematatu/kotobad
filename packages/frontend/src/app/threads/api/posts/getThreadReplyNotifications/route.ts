import {
	GetThreadReplyNotificationsQuerySchema,
	ThreadReplyNotificationListSchema,
} from "@kotobad/shared/src/schemas/post";
import type { ThreadReplyNotificationListType } from "@kotobad/shared/src/types/post";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function GET(req: Request) {
	try {
		const requestUrl = new URL(req.url);
		const query = GetThreadReplyNotificationsQuerySchema.parse({
			since: requestUrl.searchParams.get("since") ?? undefined,
			limit: requestUrl.searchParams.get("limit") ?? undefined,
		});

		const response = await getThreadReplyNotifications(query);
		return NextResponse.json(response);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to fetch thread reply notifications",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to fetch thread reply notifications" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to fetch thread reply notifications via BFF", error);
		return NextResponse.json(
			{ error: "Failed to fetch thread reply notifications" },
			{ status: 500 },
		);
	}
}

async function getThreadReplyNotifications(query: {
	since?: number;
	limit: number;
}): Promise<ThreadReplyNotificationListType> {
	const targetUrl = await getApiUrl("GET_THREAD_REPLY_NOTIFICATIONS");
	targetUrl.searchParams.set("limit", String(query.limit));
	if (typeof query.since === "number") {
		targetUrl.searchParams.set("since", String(query.since));
	}
	const raw = await BffFetcher<unknown>(targetUrl, {
		method: "GET",
		credentials: "include",
	});
	return ThreadReplyNotificationListSchema.parse(raw);
}
