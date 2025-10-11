import { createRoute, z } from "@hono/zod-openapi";
import {
	OpenAPIPostListSchema,
	OpenAPIPostSchema,
} from "../../../../models/posts";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { AppEnvironment } from "../../../../types";
import { RouteHandler } from "@hono/zod-openapi";

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

export const getAllPostRoute = createRoute({
	method: "get",
	path: "/",
	description: "すべての投稿をリストで取得します",
	responses: {
		200: {
			description: "投稿のリスト",
			content: {
				"application/json": {
					schema: OpenAPIPostListSchema,
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
		console.log("threadId", threadId);

		const posts = await db.query.posts.findMany({
			where: (posts, { eq }) => eq(posts.threadId, threadId),
			with: {
				author: {
					columns: {
						username: true,
					},
				},
			},
			orderBy: (posts, { asc }) => [asc(posts.localId)],
		});

		if (!posts) {
			return c.json({ error: "Post not found" }, 404);
		}

		return c.json(posts, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to fetch post", message: e.message }, 500);
	}
};

export const getAllPostRouter: RouteHandler<
	typeof getAllPostRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const page = Number(c.req.query("page") || "1");
		const limit = 20;
		const posts = await db.query.posts.findMany({
			with: {
				author: {
					columns: {
						username: true,
					},
				},
			},
			limit: limit,
			offset: (page - 1) * limit,
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		});

		return c.json(posts, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to fetch posts", message: e.message }, 500);
	}
};

export const getPostByIdRouter: RouteHandler<
	typeof getPostByIdRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("postId"));

		const post = await db.query.posts.findFirst({
			where: (posts, { eq }) => eq(posts.id, id),
			with: {
				author: {
					columns: {
						username: true,
					},
				},
			},
		});

		if (!post) {
			return c.json({ error: "Post not found" }, 404);
		}

		return c.json(post, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to fetch post", message: e.message }, 500);
	}
};

export const searchPostRouter: RouteHandler<
	typeof searchPostRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const query = c.req.query("q");
		if (!query) {
			return c.json({ error: "Query parameter 'q' is required" }, 400);
		}

		const posts = await db.query.posts.findMany({
			where: (posts, { or, like }) => or(like(posts.post, `%${query}%`)),
			with: {
				author: {
					columns: {
						username: true,
					},
				},
			},
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		});

		if (!posts) {
			return c.json({ error: "Post not found" }, 404);
		}

		return c.json(posts, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to fetch posts", message: e.message }, 500);
	}
};

export type GetAllPostRouteType = typeof getAllPostRoute;
export type GetPostByIdRouteType = typeof getPostByIdRoute;
export type SearchPostRouteType = typeof searchPostRoute;
