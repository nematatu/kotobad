import {
	DeveloperRoadmapItemSchema,
	UpdateDeveloperRoadmapStatusSchema,
} from "@kotobad/shared/src/schemas/developerRoadmap";
import type {
	DeveloperRoadmapItemType,
	UpdateDeveloperRoadmapStatusType,
} from "@kotobad/shared/src/types/developerRoadmap";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

type Params = {
	params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
	const { id } = await params;

	try {
		const json = await req.json();
		const value = UpdateDeveloperRoadmapStatusSchema.parse(json);
		const raw = await updateDeveloperRoadmapStatus(id, value);
		const roadmapItem = DeveloperRoadmapItemSchema.parse(raw);

		return NextResponse.json(roadmapItem, { status: 200 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to update developer roadmap item status",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = {
						error: "Failed to update developer roadmap item status",
					};
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to update developer roadmap status via BFF", error);
		return NextResponse.json(
			{ error: "Failed to update developer roadmap item status" },
			{ status: 500 },
		);
	}
}

async function updateDeveloperRoadmapStatus(
	id: string,
	values: UpdateDeveloperRoadmapStatusType,
) {
	const baseUrl = await getApiUrl("GET_ALL_DEVELOPER_ROADMAP");
	const targetUrl = new URL(
		`${id}/status`,
		`${baseUrl.toString().replace(/\/?$/, "/")}`,
	);

	return BffFetcher<DeveloperRoadmapItemType>(targetUrl, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
