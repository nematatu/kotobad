import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { ErrorResponse } from "../../../../models/error";
import { OpenAPITagListSchema } from "../../../../models/tags";
import type { AppEnvironment } from "../../../../types";

export const getAllTagRoute = createRoute({
	method: "get",
	path: "/",
	description: "すべてのタグをリストで取得します",
	responses: {
		200: {
			description: "タグのリスト",
			content: {
				"application/json": {
					schema: OpenAPITagListSchema,
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

export const getAllTagRouter: RouteHandler<
	typeof getAllTagRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");

		try {
			const tagsResult = await db.query.tags.findMany({});
			return c.json(tagsResult, 200);
		} catch (error: unknown) {
			const message = getErrorMessage(error);
			if (!message.includes("no such table: tags")) {
				throw error;
			}

			const legacyResult = await c.env.DB.prepare(
				"select id, name from labels",
			).all();
			const legacyTags: TagListType = legacyResult.results.map((row) => ({
				id: Number(row.id),
				name: String(row.name),
				iconType: "none" as const,
				iconValue: "",
			}));
			return c.json(legacyTags, 200);
		}
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to fetch tags",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};

export type GetAllThreadRouteType = typeof getAllTagRoute;
