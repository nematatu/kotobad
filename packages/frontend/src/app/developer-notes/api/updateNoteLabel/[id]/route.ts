import {
	DeveloperNoteSchema,
	UpdateDeveloperNoteLabelSchema,
} from "@kotobad/shared/src/schemas/developerNote";
import type {
	DeveloperNoteType,
	UpdateDeveloperNoteLabelType,
} from "@kotobad/shared/src/types/developerNote";
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
		const value = UpdateDeveloperNoteLabelSchema.parse(json);
		const raw = await updateDeveloperNoteLabel(id, value);
		const developerNote = DeveloperNoteSchema.parse(raw);

		return NextResponse.json(developerNote, { status: 200 });
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status) {
			let payload: Record<string, unknown> = {
				error: "Failed to update developer note label",
			};
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body);
					if (parsed && typeof parsed === "object") {
						payload = parsed as Record<string, unknown>;
					}
				} catch {
					payload = {
						error: "Failed to update developer note label",
					};
				}
			}
			return NextResponse.json(payload, { status: fetchError.status });
		}

		console.error("Failed to update developer note label via BFF", error);
		return NextResponse.json(
			{ error: "Failed to update developer note label" },
			{ status: 500 },
		);
	}
}

async function updateDeveloperNoteLabel(
	id: string,
	values: UpdateDeveloperNoteLabelType,
) {
	const baseUrl = await getApiUrl("GET_ALL_DEVELOPER_NOTES");
	const targetUrl = new URL(
		`${id}/label`,
		`${baseUrl.toString().replace(/\/?$/, "/")}`,
	);

	return BffFetcher<DeveloperNoteType>(targetUrl, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
