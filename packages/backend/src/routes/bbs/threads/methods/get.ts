import { createRoute, z } from "@hono/zod-openapi";
import {
	OpenAPIThreadListSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { RouteHandler } from "@hono/zod-openapi";
import { AppEnvironment } from "../../../../types";
import { threads } from "../../../../../drizzle/schema";
import { count } from "drizzle-orm";

export const getAllThreadRoute = createRoute({
	method: "get",
	path: "/",
	description: "すべてのスレッドをリストで取得します",
	responses: {
		200: {
			description: "スレッドのリスト",
			content: {
				"application/json": {
					schema: OpenAPIThreadListSchema,
				},
			},
		},
		404: {
			description: "スレッドが見つかりません",
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

export const getThreadByIdRoute = createRoute({
	method: "get",
	path: "/{id}",
	description: "idからスレッドを取得",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "123",
			}),
		}),
	},
	responses: {
		200: {
			description: "取得したスレッド",
			content: {
				"application/json": {
					schema: OpenAPIThreadSchema,
				},
			},
		},
		404: {
			description: "スレッドが見つかりません",
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

export const searchThreadRoute = createRoute({
	method: "get",
	path: "/search",
	description: "検索",
	request: {
		query: z.object({
			q: z.string().openapi({
				description: "検索キーワード",
				example: "hono",
			}),
		}),
	},
	responses: {
		200: {
			description: "取得したスレッドリスト",
			content: {
				"application/json": {
					schema: OpenAPIThreadListSchema,
				},
			},
		},
		400: {
			description: "クエリパラメータがありません",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		404: {
			description: "スレッドが見つかりません",
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

export const getAllThreadRouter: RouteHandler<
	typeof getAllThreadRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const page = Number(c.req.query("page") || "1");
		const limit = 20;

		const [threadsResult, totalCountResult] = await Promise.all([
			db.query.threads.findMany({
				with: {
					author: {
						columns: {
							username: true,
						},
					},
				},
				limit: limit,
				offset: (page - 1) * limit,
				orderBy: (threads, { desc }) => [desc(threads.createdAt)],
			}),
			db.select({ value: count() }).from(threads),
		]);

		const totalCount = totalCountResult[0]?.value ?? 0;
		if (!threadsResult || totalCount === 0) {
			return c.json({ error: "threads not found" }, 404);
		}

		return c.json({ threads: threadsResult, totalCount: totalCount }, 200);
	} catch (e: any) {
		console.error(e);
		return c.json(
			{ error: "Failed to fetch threads", message: e.message },
			500,
		);
	}
};

export const getThreadByIdRouter: RouteHandler<
	typeof getThreadByIdRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("id"));

		const thread = await db.query.threads.findFirst({
			where: (threads, { eq }) => eq(threads.id, id),
			with: {
				author: {
					columns: {
						username: true,
					},
				},
			},
		});

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		return c.json(thread, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to fetch thread", message: e.message }, 500);
	}
};

export const searchThreadRouter: RouteHandler<
	typeof searchThreadRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const query = c.req.query("q");
		const page = Number(c.req.query("page") || "1");
		const limit = 3;

		if (!query) {
			return c.json({ error: "Query parameter 'q' is required" }, 400);
		}

		const [threadsResult, totalCountResult] = await Promise.all([
			db.query.threads.findMany({
				where: (threads, { or, like }) => or(like(threads.title, `%${query}%`)),
				with: {
					author: {
						columns: {
							username: true,
						},
					},
				},
				limit: limit,
				offset: (page - 1) * limit,
				orderBy: (threads, { desc }) => [desc(threads.createdAt)],
			}),
			db.select({ value: count() }).from(threads),
		]);

		const totalCount = totalCountResult[0]?.value ?? 0;
		if (!threadsResult || totalCount === 0) {
			return c.json({ error: "threads not found" }, 404);
		}

		return c.json({ threads: threadsResult, totalCount: totalCount }, 200);
	} catch (e: any) {
		console.error(e);
		return c.json(
			{ error: "Failed to fetch threads", message: e.message },
			500,
		);
	}
};

export type GetAllThreadRouteType = typeof getAllThreadRoute;
export type GetThreadByIdRouteType = typeof getThreadByIdRoute;
export type SearchThreadRouteType = typeof searchThreadRouter;
