import {
	CreateDeveloperNoteSchema,
	DeveloperNoteSchema,
} from "@kotobad/shared/src/schemas/developerNote";
import type {
	CreateDeveloperNoteType,
	DeveloperNoteType,
} from "@kotobad/shared/src/types/developerNote";
import { NextResponse } from "next/server";
import { BffFetcher, type BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const value = CreateDeveloperNoteSchema.parse(json);
		const raw = await createDeveloperNote(value);
		const developerNote = DeveloperNoteSchema.parse(raw);

		return NextResponse.json(developerNote, { status: 201 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to create developer note",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = { error: "Failed to create developer note" };
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to create developer note via BFF", error);
		return NextResponse.json(
			{ error: "Failed to create developer note" },
			{ status: 500 },
		);
	}
}

async function createDeveloperNote(values: CreateDeveloperNoteType) {
	const url = await getApiUrl("CREATE_DEVELOPER_NOTE");
	return BffFetcher<DeveloperNoteType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
