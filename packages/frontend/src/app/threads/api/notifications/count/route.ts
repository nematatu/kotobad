import { NotificationUnreadCountSchema } from "@kotobad/shared/src/schemas/notifications";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function GET() {
	try {
		const raw = await getNotificationCount();
		const response = NotificationUnreadCountSchema.parse(raw);
		return NextResponse.json(response);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to fetch notification count",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to fetch notification count" };
				}
			}

			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to fetch notification count via BFF", error);
		return NextResponse.json(
			{ error: "Failed to fetch notification count" },
			{ status: 500 },
		);
	}
}

async function getNotificationCount() {
	const url = await getApiUrl("GET_NOTIFICATIONS_COUNT");
	return BffFetcher(url, {
		method: "GET",
		credentials: "include",
	});
}
