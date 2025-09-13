import { createRoute } from "@hono/zod-openapi";
import { OpenAPILabelListSchema } from "../../../../models/labels";
import { ErrorResponse } from "../../../../models/error";
import { RouteHandler } from "@hono/zod-openapi";
import { AppEnvironment } from "../../../../types";

export const getAllLabelRoute = createRoute({
	method: "get",
	path: "/",
	description: "すべてのラベルをリストで取得します",
	responses: {
		200: {
			description: "ラベルのリスト",
			content: {
				"application/json": {
					schema: OpenAPILabelListSchema,
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

export const getAllLabelRouter: RouteHandler<
	typeof getAllLabelRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");

		const labelsResult = await db.query.labels.findMany({});

		return c.json(labelsResult, 200);
	} catch (e: any) {
		console.error(e);
		return c.json(
			{ error: "Failed to fetch threads", message: e.message },
			500,
		);
	}
};

export type GetAllThreadRouteType = typeof getAllLabelRoute;
