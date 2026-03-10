import {
	CreateDeveloperRoadmapItemSchema,
	DeveloperRoadmapItemSchema,
} from "@kotobad/shared/src/schemas/developerRoadmap";
import type {
	CreateDeveloperRoadmapItemType,
	DeveloperRoadmapItemType,
} from "@kotobad/shared/src/types/developerRoadmap";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const value = CreateDeveloperRoadmapItemSchema.parse(json);
		const raw = await createDeveloperRoadmap(value);
		const roadmapItem = DeveloperRoadmapItemSchema.parse(raw);

		return NextResponse.json(roadmapItem, { status: 201 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to create developer roadmap item",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to create developer roadmap item" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to create developer roadmap via BFF", error);
		return NextResponse.json(
			{ error: "Failed to create developer roadmap item" },
			{ status: 500 },
		);
	}
}

async function createDeveloperRoadmap(values: CreateDeveloperRoadmapItemType) {
	const url = await getApiUrl("CREATE_DEVELOPER_ROADMAP");
	return BffFetcher<DeveloperRoadmapItemType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
