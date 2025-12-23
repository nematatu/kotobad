import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { ErrorResponse } from "../../../../models/error";
import { OpenAPITagListSchema } from "../../../../models/tags";
import type { AppEnvironment } from "../../../../types";
import { getErrorMessage } from "../../../../utils/errors";

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

		const tagsResult = await db.query.tags.findMany({});

		return c.json(tagsResult, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to fetch threads",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};

export type GetAllThreadRouteType = typeof getAllTagRoute;
