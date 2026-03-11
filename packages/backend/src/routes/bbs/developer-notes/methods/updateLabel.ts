import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import {
	developerNoteLabels,
	developerNotes,
} from "../../../../../drizzle/schema";
import {
	OpenAPIDeveloperNoteSchema,
	OpenAPIUpdateDeveloperNoteLabelSchema,
} from "../../../../models/developerNotes";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { canCreateDeveloperNote } from "./config";
import { toDeveloperNoteResponse } from "./transform";

export const updateDeveloperNoteLabelRoute = createRoute({
	method: "patch",
	path: "/:id/label",
	description: "開発者のボヤキのラベルを更新",
	request: {
		params: z.object({
			id: z.string(),
		}),
		body: {
			content: {
				"application/json": {
					schema: OpenAPIUpdateDeveloperNoteLabelSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新後のボヤキ",
			content: {
				"application/json": {
					schema: OpenAPIDeveloperNoteSchema,
				},
			},
		},
		401: {
			description: "未認証",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		403: {
			description: "更新権限なし",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		404: {
			description: "ボヤキまたはラベルが存在しない",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		400: {
			description: "バリデーションエラー",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
						details: z.string(),
					}),
				},
			},
		},
		500: {
			description: "サーバーエラー",
			content: {
				"application/json": {
					schema: ErrorResponse,
				},
			},
		},
	},
});

export const updateDeveloperNoteLabelRouter: RouteHandler<
	typeof updateDeveloperNoteLabelRoute,
	AppEnvironment
> = async (c) => {
	const db = c.get("db");
	const user = c.get("betterAuthUser");

	if (!canCreateDeveloperNote(c.env, user.id)) {
		return c.json({ error: "Forbidden" }, 403);
	}

	const noteId = Number(c.req.param("id"));
	if (!Number.isInteger(noteId) || noteId <= 0) {
		return c.json(
			{ error: "Validation failed", details: "Invalid developer note id" },
			400,
		);
	}

	let validatedData: z.infer<typeof OpenAPIUpdateDeveloperNoteLabelSchema>;
	try {
		validatedData = c.req.valid("json");
	} catch (error: unknown) {
		const details =
			error instanceof z.ZodError
				? JSON.stringify(error.issues)
				: getErrorMessage(error);
		return c.json({ error: "Validation failed", details }, 400);
	}

	try {
		const existingNote = await db.query.developerNotes.findFirst({
			where: eq(developerNotes.id, noteId),
			columns: { id: true },
		});
		if (!existingNote) {
			return c.json({ error: "Developer note not found" }, 404);
		}

		if (validatedData.labelId !== null) {
			const label = await db.query.developerNoteLabels.findFirst({
				where: eq(developerNoteLabels.id, validatedData.labelId),
				columns: { id: true },
			});
			if (!label) {
				return c.json({ error: "Developer note label not found" }, 404);
			}
		}

		await db
			.update(developerNotes)
			.set({
				labelId: validatedData.labelId,
				updatedAt: new Date(),
			})
			.where(eq(developerNotes.id, noteId));

		const updatedNote = await db.query.developerNotes.findFirst({
			where: eq(developerNotes.id, noteId),
			with: {
				author: {
					columns: {
						name: true,
						image: true,
					},
				},
				label: {
					columns: {
						id: true,
						code: true,
						name: true,
					},
				},
			},
		});

		if (!updatedNote) {
			return c.json(
				{ error: "Developer note not found after update", message: "" },
				500,
			);
		}

		return c.json(toDeveloperNoteResponse(updatedNote), 200);
	} catch (error: unknown) {
		return c.json(
			{
				error: "internal server error",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
