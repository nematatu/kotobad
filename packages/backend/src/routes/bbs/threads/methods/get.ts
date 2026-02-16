import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, count, inArray, like } from "drizzle-orm";
import { threads, users } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPIThreadListSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import type { AppEnvironment } from "../../../../types";
import { toThreadResponse } from "./transform";

type ThreadWithOptionalAuthor = {
	id: number;
	authorId: string;
	author?: { name?: string | null; image?: string | null } | null;
};

const fillLegacyAuthorNames = async <T extends ThreadWithOptionalAuthor>(
	db: AppEnvironment["Variables"]["db"],
	threads: T[],
): Promise<T[]> => {
	const missingThreads = threads.filter((thread) => !thread.author?.name);
	if (missingThreads.length === 0) {
		return threads;
	}

	const missingAuthorIds = missingThreads
		.map((thread) => Number(thread.authorId))
		.filter((authorId) => Number.isInteger(authorId));

	if (missingAuthorIds.length === 0) {
		throw new Error(
			`Missing author name for threads: ${missingThreads
				.map((thread) => thread.id)
				.join(", ")}`,
		);
	}

	const uniqueAuthorIds = Array.from(new Set(missingAuthorIds));
	const legacyUsers = await db.query.users.findMany({
		where: inArray(users.id, uniqueAuthorIds),
		columns: { id: true, username: true },
	});

	const legacyUserMap = new Map(
		legacyUsers.map((legacyUser) => [
			String(legacyUser.id),
			legacyUser.username,
		]),
	);

	return threads.map((thread) => {
		if (thread.author?.name) {
			return thread;
		}
		const legacyName = legacyUserMap.get(String(thread.authorId));
		if (!legacyName) {
			throw new Error(`Missing author name for thread ${thread.id}`);
		}
		return {
			...thread,
			author: { name: legacyName, image: thread.author?.image ?? null },
		};
	});
};

const SortSchema = z.enum(["new", "old"]).default("new");

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

		const limit = PERPAGE;

		c.header("Cache-Control", "no-store");

		const [threadsResult, totalCountResult] = await Promise.all([
			db.query.threads.findMany({
				with: {
					author: {
						columns: { name: true, image: true },
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
		const resolvedThreads = await fillLegacyAuthorNames(db, threadsResult);
		const threadsResponse = resolvedThreads.map((thread) =>
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
						image: true,
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
		const [resolvedThread] = await fillLegacyAuthorNames(db, [thread]);
		return c.json(toThreadResponse(resolvedThread), 200);
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

		const resolvedThreads = await fillLegacyAuthorNames(db, threadsResult);
		const threadsResponse = resolvedThreads.map((thread) =>
			toThreadResponse(thread),
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
