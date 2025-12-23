import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { count } from "drizzle-orm";
import { threads } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPIPostListSchema } from "../../../../models/posts";
import {
	OpenAPIThreadListSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import type { AppEnvironment } from "../../../../types";
import { getErrorMessage } from "../../../../utils/errors";
import { toThreadResponse } from "./transform";

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

const ThreadWithPostsResponseSchema = z.object({
	thread: OpenAPIThreadSchema,
	posts: OpenAPIPostListSchema,
});

export const getThreadWithPostsRoute = createRoute({
	method: "get",
	path: "/full/{id}",
	description: "スレッド本体と投稿一覧を同時に取得",
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
			description: "スレッドと投稿一覧",
			content: {
				"application/json": {
					schema: ThreadWithPostsResponseSchema,
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
		const pageParam = c.req.query("page");
		const page = pageParam ? Number(pageParam) : undefined;
		const limit = PERPAGE;

		// Edge キャッシュを効かせて初回以外の応答を高速化
		c.header(
			"Cache-Control",
			"public, s-maxage=900, stale-while-revalidate=900",
		);

		let threadsResult: Awaited<ReturnType<typeof db.query.threads.findMany>>;
		let totalCountResult: Array<{ value: number | null }>;

		if (page) {
			// ページ指定あり → ページネーション
			[threadsResult, totalCountResult] = await Promise.all([
				db.query.threads.findMany({
					with: {
						author: {
							columns: { name: true },
						},
						threadTags: {
							with: {
								tags: true,
							},
						},
					},
					limit: limit,
					offset: (page - 1) * limit,
					orderBy: (threads, { desc }) => [desc(threads.createdAt)],
				}),
				db.select({ value: count() }).from(threads),
			]);
		} else {
			// ページ指定なし → 全件取得
			[threadsResult, totalCountResult] = await Promise.all([
				db.query.threads.findMany({
					with: {
						author: { columns: { name: true } },
						threadTags: {
							with: {
								tags: true,
							},
						},
					},
					orderBy: (threads, { desc }) => [desc(threads.createdAt)],
				}),
				db.select({ value: count() }).from(threads),
			]);
		}

		const totalCount = totalCountResult[0]?.value ?? 0;
		const threadsResponse = threadsResult.map((thread) =>
			toThreadResponse(thread),
		);
		return c.json({ threads: threadsResponse, totalCount: totalCount }, 200);
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
						name: true,
					},
				},
				threadTags: {
					with: {
						tags: true,
					},
				},
			},
		});

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		c.header(
			"Cache-Control",
			"public, s-maxage=900, stale-while-revalidate=900",
		);
		return c.json(toThreadResponse(thread), 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to fetch thread", message: getErrorMessage(error) },
			500,
		);
	}
};

export const getThreadWithPostsRouter: RouteHandler<
	typeof getThreadWithPostsRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("id"));

		const [thread, postsResult] = await Promise.all([
			db.query.threads.findFirst({
				where: (threads, { eq }) => eq(threads.id, id),
				with: {
					author: {
						columns: {
							name: true,
						},
					},
					threadTags: {
						with: {
							tags: true,
						},
					},
				},
			}),
			db.query.posts.findMany({
				where: (posts, { eq }) => eq(posts.threadId, id),
				with: {
					author: {
						columns: {
							name: true,
						},
					},
				},
				orderBy: (posts, { asc }) => [asc(posts.localId)],
			}),
		]);

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		c.header(
			"Cache-Control",
			"public, s-maxage=60, stale-while-revalidate=300",
		);
		return c.json(
			{
				thread: toThreadResponse(thread),
				posts: postsResult,
			},
			200,
		);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to fetch thread", message: getErrorMessage(error) },
			500,
		);
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
							name: true,
						},
					},
					threadTags: {
						with: {
							tags: true,
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

		const threadsResponse = threadsResult.map((thread) =>
			toThreadResponse(thread),
		);
		return c.json({ threads: threadsResponse, totalCount: totalCount }, 200);
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

export type GetAllThreadRouteType = typeof getAllThreadRoute;
export type GetThreadByIdRouteType = typeof getThreadByIdRoute;
export type SearchThreadRouteType = typeof searchThreadRouter;
export type GetThreadWithPostsRouteType = typeof getThreadWithPostsRoute;
