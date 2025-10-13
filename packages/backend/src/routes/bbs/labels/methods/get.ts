import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { ErrorResponse } from "../../../../models/error";
import { OpenAPILabelListSchema } from "../../../../models/labels";
import type { AppEnvironment } from "../../../../types";
import { getErrorMessage } from "../../../../utils/errors";

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

export type GetAllThreadRouteType = typeof getAllLabelRoute;
