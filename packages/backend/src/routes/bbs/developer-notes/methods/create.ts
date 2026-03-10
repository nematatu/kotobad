import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import { developerNotes } from "../../../../../drizzle/schema";
import {
	OpenAPICreateDeveloperNoteSchema,
	OpenAPIDeveloperNoteSchema,
} from "../../../../models/developerNotes";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { canCreateDeveloperNote } from "./config";
import { toDeveloperNoteResponse } from "./transform";

export const createDeveloperNoteRoute = createRoute({
	method: "post",
	path: "/create",
	description: "開発者のボヤキを投稿",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPICreateDeveloperNoteSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "作成されたボヤキ",
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
			description: "投稿権限なし",
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

export const createDeveloperNoteRouter: RouteHandler<
	typeof createDeveloperNoteRoute,
	AppEnvironment
> = async (c) => {
	const db = c.get("db");
	const user = c.get("betterAuthUser");

	if (!canCreateDeveloperNote(c.env, user.id)) {
		return c.json({ error: "Forbidden" }, 403);
	}

	let validatedData: z.infer<typeof OpenAPICreateDeveloperNoteSchema>;
	try {
		validatedData = c.req.valid("json");
	} catch (error: unknown) {
		const details =
			error instanceof z.ZodError
				? JSON.stringify(error.issues)
				: getErrorMessage(error);
		console.error("Validation error:", details);
		return c.json({ error: "Validation failed", details }, 400);
	}

	try {
		const result = await db
			.insert(developerNotes)
			.values({
				content: validatedData.content,
				kind: validatedData.kind,
				status: validatedData.status,
				authorId: user.id,
			})
			.returning({ id: developerNotes.id });

		const newDeveloperNoteId = result[0]?.id;

		if (!newDeveloperNoteId) {
			return c.json(
				{ error: "Failed to create developer note", message: "" },
				500,
			);
		}

		const createdNote = await db.query.developerNotes.findFirst({
			where: eq(developerNotes.id, newDeveloperNoteId),
			with: {
				author: {
					columns: {
						name: true,
						image: true,
					},
				},
			},
		});

		if (!createdNote) {
			return c.json(
				{ error: "Developer note not found after creation", message: "" },
				500,
			);
		}

		return c.json(toDeveloperNoteResponse(createdNote), 201);
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
