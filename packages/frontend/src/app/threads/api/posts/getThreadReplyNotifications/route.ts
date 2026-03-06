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
			cursorCreatedAt:
				requestUrl.searchParams.get("cursorCreatedAt") ?? undefined,
			cursorPostId: requestUrl.searchParams.get("cursorPostId") ?? undefined,
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
	cursorCreatedAt?: number;
	cursorPostId?: number;
	limit: number;
}): Promise<ThreadReplyNotificationListType> {
	const targetUrl = await getApiUrl("GET_THREAD_REPLY_NOTIFICATIONS");
	targetUrl.searchParams.set("limit", String(query.limit));
	if (
		typeof query.cursorCreatedAt === "number" &&
		typeof query.cursorPostId === "number"
	) {
		targetUrl.searchParams.set(
			"cursorCreatedAt",
			String(query.cursorCreatedAt),
		);
		targetUrl.searchParams.set("cursorPostId", String(query.cursorPostId));
	}
	const raw = await BffFetcher<unknown>(targetUrl, {
		method: "GET",
		credentials: "include",
	});
	return ThreadReplyNotificationListSchema.parse(raw);
}
