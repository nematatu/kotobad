import { eq } from "drizzle-orm";
import { posts } from "../../../../../drizzle/schema";
import { createRoute, z } from "@hono/zod-openapi";
import {
	OpenAPIEditPostSchema,
	OpenAPIPostSchema,
} from "../../../../models/posts";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { AppEnvironment } from "../../../../types";
import { RouteHandler } from "@hono/zod-openapi";

export const editPostRoute = createRoute({
	method: "put",
	path: "/edit/{id}",
	description: "投稿を編集",
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "1",
			}),
		}),
		body: {
			content: {
				"application/json": {
					schema: OpenAPIEditPostSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新された投稿",
			content: {
				"application/json": {
					schema: OpenAPIPostSchema,
				},
			},
		},
		403: {
			description: "権限がありません",
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
				"application/json": {
					schema: ErrorResponse,
				},
			},
		},
	},
});

export const editPostRouter: RouteHandler<
	typeof editPostRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("id"));
		const user = c.get("user");

		const { title, description } = c.req.valid("json");

		const postResult = await db.select().from(posts).where(eq(posts.id, id));
		const post = postResult[0];

		if (!post) {
			return c.json({ error: "Post not found" }, 404);
		}

		if (post.authorId !== user.id) {
			return c.json({ error: "Forbidden" }, 403);
		}

		const result = await db
			.update(posts)
			.set({ title, description })
			.where(eq(posts.id, id))
			.returning();

		const edietedPost = result[0];

		return c.json(edietedPost, 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to edit post", message: e.message }, 500);
	}
};

export type EditPostRouterType = typeof editPostRouter;
