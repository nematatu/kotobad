import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { posts as postsTable } from "../../../../../drizzle/schema";
import { createAuth } from "../../../../auth";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPIPostListSchema,
	OpenAPIPostSchema,
} from "../../../../models/posts";
import type { AppEnvironment } from "../../../../types";
import { getPostReactions, getPostReactionsByPost } from "./reactions-summary";
import { toPostResponse } from "./transform";

const resolveViewerUserId = async (c: {
	env: AppEnvironment["Bindings"];
	req: { raw: Request };
}): Promise<string | null> => {
	try {
		const auth = createAuth({ env: c.env, restRequest: c.req.raw });
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});
		return session?.user?.id ?? null;
	} catch {
		return null;
	}
};

export const getPostByThreadIdRoute = createRoute({
	method: "get",
	path: "/byThreadId/{threadId}",
	description: "指定したスレッドの投稿をリストで取得します",
	request: {
		params: z.object({
			threadId: z.string().openapi({
				param: {
					name: "threadId",
					in: "path",
				},
				example: "123",
			}),
		}),
	},
	responses: {
		200: {
			description: "投稿のリスト",
			content: {
				"application/json": {
					schema: OpenAPIPostListSchema,
				},
			},
		},
		404: {
			description: "投稿が見つかりません",
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

export const getPostByIdRoute = createRoute({
	method: "get",
	path: "/{postId}",
	description: "idから投稿を取得",
	request: {
		params: z.object({
			postId: z.string().openapi({
				param: {
					name: "postId",
					in: "path",
				},
				example: "123",
			}),
		}),
	},
	responses: {
		200: {
			description: "取得した投稿",
			content: {
				"application/json": {
					schema: OpenAPIPostSchema,
				},
			},
		},
		404: {
			description: "投稿が見つかりません",
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

export const searchPostRoute = createRoute({
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
			description: "取得した投稿リスト",
			content: {
				"application/json": {
					schema: OpenAPIPostListSchema,
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
			description: "投稿が見つかりません",
			content: {
				"application/json": {
					schema: SimpleErrorResponse,
				},
			},
		},
		500: {
			description: "サーバーエラー",
			content: {
				"application/json": { schema: ErrorResponse },
			},
		},
	},
});

export const getPostByThreadIdRouter: RouteHandler<
	typeof getPostByThreadIdRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const threadId = Number(c.req.param("threadId"));
		const viewerUserId = await resolveViewerUserId(c);

		const posts = await db.query.posts.findMany({
			where: (posts, { eq }) => eq(posts.threadId, threadId),
			with: {
				author: {
					columns: {
						name: true,
						image: true,
					},
				},
				postImages: {
					columns: {
						imageUrl: true,
						sortOrder: true,
					},
				},
			},
			orderBy: (posts, { desc }) => [desc(posts.localId)],
		});

		if (!posts) {
			return c.json({ error: "Post not found" }, 404);
		}

		const replyCountRows = await db
			.select({
				replyToPostId: postsTable.replyToPostId,
				replyCount: sql<number>`count(*)`,
			})
			.from(postsTable)
			.where(
				and(
					eq(postsTable.threadId, threadId),
					isNotNull(postsTable.replyToPostId),
				),
			)
			.groupBy(postsTable.replyToPostId);

		const replyCountMap = new Map<number, number>();
		for (const row of replyCountRows) {
			if (typeof row.replyToPostId === "number") {
				replyCountMap.set(row.replyToPostId, row.replyCount);
			}
		}

		const reactionMap = await getPostReactions({ db, posts, viewerUserId });
		const response = posts.map((post) =>
			toPostResponse(
				{
					...post,
					reactions: reactionMap.get(post.id) ?? [],
					replyCount: replyCountMap.get(post.id) ?? 0,
				},
				{
					viewerUserId,
				},
			),
		);
		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to fetch post", message: getErrorMessage(error) },
			500,
		);
	}
};

export const getPostByIdRouter: RouteHandler<
	typeof getPostByIdRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("postId"));
		const viewerUserId = await resolveViewerUserId(c);

		const post = await db.query.posts.findFirst({
			where: (posts, { eq }) => eq(posts.id, id),
			with: {
				author: {
					columns: {
						name: true,
						image: true,
					},
				},
				postImages: {
					columns: {
						imageUrl: true,
						sortOrder: true,
					},
				},
			},
		});

		if (!post) {
			return c.json({ error: "Post not found" }, 404);
		}

		const reactionMap = await getPostReactionsByPost({
			db,
			post,
			viewerUserId,
		});
		const [{ replyCount }] = await db
			.select({
				replyCount: sql<number>`count(*)`,
			})
			.from(postsTable)
			.where(eq(postsTable.replyToPostId, post.id));

		const response = toPostResponse(
			{
				...post,
				reactions: reactionMap.get(post.id) ?? [],
				replyCount,
			},
			{
				viewerUserId,
			},
		);
		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to fetch post", message: getErrorMessage(error) },
			500,
		);
	}
};

export const searchPostRouter: RouteHandler<
	typeof searchPostRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const viewerUserId = await resolveViewerUserId(c);
		const query = c.req.query("q");
		if (!query) {
			return c.json({ error: "Query parameter 'q' is required" }, 400);
		}

		const posts = await db.query.posts.findMany({
			where: (posts, { or, like }) => or(like(posts.post, `%${query}%`)),
			with: {
				author: {
					columns: {
						name: true,
						image: true,
					},
				},
				postImages: {
					columns: {
						imageUrl: true,
						sortOrder: true,
					},
				},
			},
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		});

		if (!posts) {
			return c.json({ error: "Post not found" }, 404);
		}

		const postIds = posts.map((post) => post.id);
		const replyCountRows =
			postIds.length === 0
				? []
				: await db
						.select({
							replyToPostId: postsTable.replyToPostId,
							replyCount: sql<number>`count(*)`,
						})
						.from(postsTable)
						.where(
							and(
								isNotNull(postsTable.replyToPostId),
								inArray(postsTable.replyToPostId, postIds),
							),
						)
						.groupBy(postsTable.replyToPostId);
		const replyCountMap = new Map<number, number>();
		for (const row of replyCountRows) {
			if (typeof row.replyToPostId === "number") {
				replyCountMap.set(row.replyToPostId, row.replyCount);
			}
		}

		const reactionMap = await getPostReactions({ db, posts, viewerUserId });
		const response = posts.map((post) =>
			toPostResponse(
				{
					...post,
					reactions: reactionMap.get(post.id) ?? [],
					replyCount: replyCountMap.get(post.id) ?? 0,
				},
				{
					viewerUserId,
				},
			),
		);
		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to fetch posts", message: getErrorMessage(error) },
			500,
		);
	}
};

export type GetPostByIdRouteType = typeof getPostByIdRoute;
export type SearchPostRouteType = typeof searchPostRoute;
