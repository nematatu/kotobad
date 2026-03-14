import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, count, inArray, like } from "drizzle-orm";
import { threads } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPIThreadListSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import type { AppEnvironment } from "../../../../types";
import { getThreadLikeSummaryMap } from "./likes-summary";
import { toThreadResponse } from "./transform";
import {
	getLatestThreadTrends,
	refreshThreadTrends,
	TREND_DEFAULT_LIMIT,
	TREND_MAX_LIMIT,
} from "./trending";
import { resolveViewerUserId } from "./viewer-session";

const SortSchema = z.enum(["new", "old"]).default("new");
const TrendLimitSchema = z.coerce
	.number()
	.int()
	.min(1)
	.max(TREND_MAX_LIMIT)
	.default(TREND_DEFAULT_LIMIT);

export const getAllThreadRoute = createRoute({
	method: "get",
	path: "/",
	description: "すべてのスレッドをリストで取得します",
	request: {
		query: z.object({
			page: z.coerce.number().int().min(1).default(1),
			sort: SortSchema,
		}),
	},
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

export const getTrendingThreadRoute = createRoute({
	method: "get",
	path: "/trending",
	description:
		"トレンドスレッドを取得（投稿数・いいね数・最新更新時刻の合成スコア）",
	request: {
		query: z.object({
			limit: TrendLimitSchema,
		}),
	},
	responses: {
		200: {
			description: "トレンドスレッドのリスト",
			content: {
				"application/json": {
					schema: OpenAPIThreadListSchema,
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
			page: z.coerce.number().int().min(1).default(1).openapi({
				description: "ページ番号",
				example: "1",
			}),
			limit: z.coerce.number().int().min(1).default(20).openapi({
				description: "1ページあたりの件数",
				example: "20",
			}),
			sort: SortSchema,
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
		const { page, sort } = c.req.valid("query");
		const viewerUserId = await resolveViewerUserId(c);

		const limit = PERPAGE;

		c.header("Cache-Control", "no-store");

		const [threadsResult, totalCountResult] = await Promise.all([
			db.query.threads.findMany({
				with: {
					author: {
						columns: { name: true, image: true, bio: true },
					},
					threadImages: {
						columns: {
							imageUrl: true,
							sortOrder: true,
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
				orderBy: (threads, { desc, asc }) =>
					sort === "new"
						? [desc(threads.createdAt), desc(threads.id)]
						: [asc(threads.createdAt), asc(threads.id)],
			}),
			db.select({ value: count() }).from(threads),
		]);

		const totalCount = totalCountResult[0]?.value ?? 0;
		const likeMap = await getThreadLikeSummaryMap({
			db,
			threadIds: threadsResult.map((thread) => thread.id),
			viewerUserId,
		});
		const threadsResponse = threadsResult.map((thread) => {
			const like = likeMap.get(thread.id);
			return toThreadResponse({
				...thread,
				likeCount: like?.likeCount ?? 0,
				likedByMe: like?.likedByMe ?? false,
			});
		});

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
		const viewerUserId = await resolveViewerUserId(c);

		const thread = await db.query.threads.findFirst({
			where: (threads, { eq }) => eq(threads.id, id),
			with: {
				author: {
					columns: {
						name: true,
						image: true,
						bio: true,
					},
				},
				threadImages: {
					columns: {
						imageUrl: true,
						sortOrder: true,
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

		c.header("Cache-Control", "no-store");
		const likeMap = await getThreadLikeSummaryMap({
			db,
			threadIds: [thread.id],
			viewerUserId,
		});
		const like = likeMap.get(thread.id);
		return c.json(
			toThreadResponse({
				...thread,
				likeCount: like?.likeCount ?? 0,
				likedByMe: like?.likedByMe ?? false,
			}),
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

export const getTrendingThreadRouter: RouteHandler<
	typeof getTrendingThreadRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const viewerUserId = await resolveViewerUserId(c);
		const { limit } = c.req.valid("query");

		c.header("Cache-Control", "no-store");

		let trendRows = await getLatestThreadTrends({
			db,
			limit,
		});

		if (trendRows.length === 0) {
			await refreshThreadTrends({ db });
			trendRows = await getLatestThreadTrends({
				db,
				limit,
			});
		}

		const rankedThreadIds = trendRows.map((row) => row.threadId);

		if (rankedThreadIds.length === 0) {
			return c.json({ threads: [], totalCount: 0 }, 200);
		}

		const sourceThreads = await db.query.threads.findMany({
			where: inArray(threads.id, rankedThreadIds),
			with: {
				author: {
					columns: { name: true, image: true, bio: true },
				},
				threadImages: {
					columns: {
						imageUrl: true,
						sortOrder: true,
					},
				},
				threadTags: {
					with: {
						tags: true,
					},
				},
			},
		});

		const likeMap = await getThreadLikeSummaryMap({
			db,
			threadIds: rankedThreadIds,
			viewerUserId,
		});
		const threadMap = new Map(
			sourceThreads.map((thread) => {
				const like = likeMap.get(thread.id);
				return [
					thread.id,
					toThreadResponse({
						...thread,
						likeCount: like?.likeCount ?? 0,
						likedByMe: like?.likedByMe ?? false,
					}),
				];
			}),
		);
		const rankedThreads = rankedThreadIds.flatMap((threadId) => {
			const thread = threadMap.get(threadId);
			return thread ? [thread] : [];
		});

		return c.json(
			{
				threads: rankedThreads,
				totalCount: rankedThreads.length,
			},
			200,
		);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to fetch trending threads",
				message: getErrorMessage(error),
			},
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
		const viewerUserId = await resolveViewerUserId(c);

		const { q, page, limit, sort } = c.req.valid("query");
		const rawQuery = (q ?? "").trim();
		const offset = (page - 1) * limit;

		c.header("Cache-Control", "no-store");

		if (!rawQuery || rawQuery.length < 2) {
			return c.json({ error: "Query parameter 'q' is required" }, 400);
		}

		const tokens = rawQuery
			.split(/\s+/)
			.map((token) => token.replace(/["'`*]/g, ""))
			.filter((token) => token.length > 0);

		if (tokens.length === 0) {
			return c.json({ error: "Query parameter 'q' is required" }, 400);
		}

		const conditions = tokens.map((token) => like(threads.title, `%${token}%`));

		const whereClause =
			conditions.length === 1 ? conditions[0] : and(...conditions);

		const [threadsResult, totalCountResult] = await Promise.all([
			db.query.threads.findMany({
				where: whereClause,
				with: {
					author: {
						columns: {
							name: true,
							image: true,
							bio: true,
						},
					},
					threadImages: {
						columns: {
							imageUrl: true,
							sortOrder: true,
						},
					},
					threadTags: {
						with: {
							tags: true,
						},
					},
				},
				limit: limit,
				offset: offset,
				orderBy: (threads, { desc, asc }) =>
					sort === "new"
						? [desc(threads.createdAt), desc(threads.id)]
						: [asc(threads.createdAt), asc(threads.id)],
			}),
			db.select({ value: count() }).from(threads).where(whereClause),
		]);

		const likeMap = await getThreadLikeSummaryMap({
			db,
			threadIds: threadsResult.map((thread) => thread.id),
			viewerUserId,
		});
		const threadsResponse = threadsResult.map((thread) =>
			toThreadResponse({
				...thread,
				likeCount: likeMap.get(thread.id)?.likeCount ?? 0,
				likedByMe: likeMap.get(thread.id)?.likedByMe ?? false,
			}),
		);
		const totalCount = totalCountResult[0]?.value ?? 0;

		return c.json({ threads: threadsResponse, totalCount }, 200);
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

export type SearchThreadRouteType = typeof searchThreadRouter;
