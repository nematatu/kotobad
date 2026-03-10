import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import { developerRoadmapItems } from "../../../../../drizzle/schema";
import {
	OpenAPIDeveloperRoadmapItemSchema,
	OpenAPIUpdateDeveloperRoadmapStatusSchema,
} from "../../../../models/developerRoadmap";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { canCreateDeveloperNote } from "../../developer-notes/methods/config";
import { toDeveloperRoadmapResponse } from "./transform";

export const updateDeveloperRoadmapStatusRoute = createRoute({
	method: "patch",
	path: "/{id}/status",
	description: "開発者ロードマップ項目の status を更新",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "1",
			}),
		}),
		body: {
			content: {
				"application/json": {
					schema: OpenAPIUpdateDeveloperRoadmapStatusSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新されたロードマップ項目",
			content: {
				"application/json": {
					schema: OpenAPIDeveloperRoadmapItemSchema,
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
		401: {
			description: "未認証",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		403: {
			description: "権限なし",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		404: {
			description: "項目が見つかりません",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
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

export const updateDeveloperRoadmapStatusRouter: RouteHandler<
	typeof updateDeveloperRoadmapStatusRoute,
	AppEnvironment
> = async (c) => {
	const db = c.get("db");
	const user = c.get("betterAuthUser");

	if (!user?.id) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	if (!canCreateDeveloperNote(c.env, user.id)) {
		return c.json({ error: "Forbidden" }, 403);
	}

	const roadmapItemId = Number(c.req.param("id"));
	if (!Number.isInteger(roadmapItemId) || roadmapItemId <= 0) {
		return c.json(
			{ error: "Validation failed", details: "Invalid roadmap id" },
			400,
		);
	}

	let validatedData: z.infer<typeof OpenAPIUpdateDeveloperRoadmapStatusSchema>;
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
		const existingItem = await db.query.developerRoadmapItems.findFirst({
			where: eq(developerRoadmapItems.id, roadmapItemId),
		});

		if (!existingItem) {
			return c.json({ error: "Developer roadmap item not found" }, 404);
		}

		if (existingItem.status === validatedData.status) {
			return c.json(toDeveloperRoadmapResponse(existingItem), 200);
		}

		const lastItemInStatus = await db.query.developerRoadmapItems.findFirst({
			where: eq(developerRoadmapItems.status, validatedData.status),
			orderBy: (table, { desc }) => [desc(table.sortOrder), desc(table.id)],
		});

		const sortOrder = (lastItemInStatus?.sortOrder ?? -1) + 1;

		await db
			.update(developerRoadmapItems)
			.set({
				status: validatedData.status,
				sortOrder,
				updatedAt: new Date(),
			})
			.where(eq(developerRoadmapItems.id, roadmapItemId));

		const updatedItem = await db.query.developerRoadmapItems.findFirst({
			where: eq(developerRoadmapItems.id, roadmapItemId),
		});

		if (!updatedItem) {
			return c.json(
				{
					error: "Developer roadmap item not found after update",
					message: "",
				},
				500,
			);
		}

		return c.json(toDeveloperRoadmapResponse(updatedItem), 200);
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
