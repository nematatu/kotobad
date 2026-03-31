import { UserProfileSelectablePlayersSchema } from "@kotobad/shared/src/schemas/user";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { toBffErrorPayload } from "@/lib/api/fetcher/errorPayload";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const targetUrl = await getApiUrl("GET_PROFILE_PLAYERS");
		targetUrl.search = searchParams.toString();
		const raw = await BffFetcher<unknown>(targetUrl, {
			method: "GET",
			credentials: "include",
		});
		const response = UserProfileSelectablePlayersSchema.parse(raw);
		return NextResponse.json(response, { status: 200 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			const payload = toBffErrorPayload(
				fetchError.body,
				"Failed to fetch profile players",
			);
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to fetch profile players via BFF", error);
		return NextResponse.json(
			{ error: "Failed to fetch profile players" },
			{ status: 500 },
		);
	}
}
