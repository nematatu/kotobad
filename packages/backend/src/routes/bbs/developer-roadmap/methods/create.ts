import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import { developerRoadmapItems } from "../../../../../drizzle/schema";
import {
	OpenAPICreateDeveloperRoadmapItemSchema,
	OpenAPIDeveloperRoadmapItemSchema,
} from "../../../../models/developerRoadmap";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { canCreateDeveloperNote } from "../../developer-notes/methods/config";
import { toDeveloperRoadmapResponse } from "./transform";

export const createDeveloperRoadmapRoute = createRoute({
	method: "post",
	path: "/create",
	description: "開発者ロードマップ項目を投稿",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPICreateDeveloperRoadmapItemSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "作成されたロードマップ項目",
			content: {
				"application/json": {
					schema: OpenAPIDeveloperRoadmapItemSchema,
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

export const createDeveloperRoadmapRouter: RouteHandler<
	typeof createDeveloperRoadmapRoute,
	AppEnvironment
> = async (c) => {
	const db = c.get("db");
	const user = c.get("betterAuthUser");

	if (!canCreateDeveloperNote(c.env, user.id)) {
		return c.json({ error: "Forbidden" }, 403);
	}

	let validatedData: z.infer<typeof OpenAPICreateDeveloperRoadmapItemSchema>;
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
		const lastItemInStatus = await db.query.developerRoadmapItems.findFirst({
			where: eq(developerRoadmapItems.status, validatedData.status),
			orderBy: (table, { desc }) => [desc(table.sortOrder), desc(table.id)],
		});

		const sortOrder = (lastItemInStatus?.sortOrder ?? -1) + 1;

		const result = await db
			.insert(developerRoadmapItems)
			.values({
				title: validatedData.title,
				status: validatedData.status,
				sortOrder,
			})
			.returning({ id: developerRoadmapItems.id });

		const newItemId = result[0]?.id;

		if (!newItemId) {
			return c.json(
				{ error: "Failed to create developer roadmap item", message: "" },
				500,
			);
		}

		const createdItem = await db.query.developerRoadmapItems.findFirst({
			where: eq(developerRoadmapItems.id, newItemId),
		});

		if (!createdItem) {
			return c.json(
				{
					error: "Developer roadmap item not found after creation",
					message: "",
				},
				500,
			);
		}

		return c.json(toDeveloperRoadmapResponse(createdItem), 201);
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
