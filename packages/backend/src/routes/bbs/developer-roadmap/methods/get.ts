import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIDeveloperRoadmapListSchema } from "../../../../models/developerRoadmap";
import { ErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { toDeveloperRoadmapResponse } from "./transform";

const ROADMAP_STATUS_ORDER = {
	wip: 0,
	todo: 1,
	done: 2,
} as const;

export const getAllDeveloperRoadmapRoute = createRoute({
	method: "get",
	path: "/",
	description: "開発者ロードマップ一覧を取得",
	responses: {
		200: {
			description: "開発者ロードマップ一覧",
			content: {
				"application/json": {
					schema: OpenAPIDeveloperRoadmapListSchema,
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

export const getAllDeveloperRoadmapRouter: RouteHandler<
	typeof getAllDeveloperRoadmapRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");

		c.header("Cache-Control", "no-store");

		const items = await db.query.developerRoadmapItems.findMany();
		const sortedItems = items.slice().sort((left, right) => {
			const statusDiff =
				ROADMAP_STATUS_ORDER[left.status] - ROADMAP_STATUS_ORDER[right.status];
			if (statusDiff !== 0) {
				return statusDiff;
			}

			const sortOrderDiff = left.sortOrder - right.sortOrder;
			if (sortOrderDiff !== 0) {
				return sortOrderDiff;
			}

			return left.id - right.id;
		});

		return c.json(sortedItems.map(toDeveloperRoadmapResponse), 200);
	} catch (error) {
		console.error("Failed to fetch developer roadmap", error);
		return c.json(
			{
				error: "Failed to fetch developer roadmap",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			500,
		);
	}
};
