import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIDeveloperNoteListSchema } from "../../../../models/developerNotes";
import { ErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { resolveViewerUserId } from "../../threads/methods/viewer-session";
import { canCreateDeveloperNote } from "./config";
import { toDeveloperNoteResponse } from "./transform";

export const getAllDeveloperNotesRoute = createRoute({
	method: "get",
	path: "/",
	description: "開発者のボヤキ一覧を取得",
	responses: {
		200: {
			description: "開発者のボヤキ一覧",
			content: {
				"application/json": {
					schema: OpenAPIDeveloperNoteListSchema,
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

export const getAllDeveloperNotesRouter: RouteHandler<
	typeof getAllDeveloperNotesRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const viewerUserId = await resolveViewerUserId(c);

		c.header("Cache-Control", "no-store");

		const notes = await db.query.developerNotes.findMany({
			with: {
				author: {
					columns: {
						name: true,
						image: true,
					},
				},
			},
			orderBy: (table, { desc }) => [desc(table.createdAt), desc(table.id)],
		});

		return c.json(
			{
				notes: notes.map(toDeveloperNoteResponse),
				canCreate: canCreateDeveloperNote(c.env, viewerUserId),
			},
			200,
		);
	} catch (error) {
		console.error("Failed to fetch developer notes", error);
		return c.json(
			{
				error: "Failed to fetch developer notes",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			500,
		);
	}
};
