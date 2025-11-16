import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { posts } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";
import { getErrorMessage } from "../../../../utils/errors";

export const deletePostRoute = createRoute({
	method: "delete",
	path: "/delete/{id}",
	description: "投稿を削除",
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
	},
	responses: {
		200: {
			description: "成功メッセージ",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
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

export const deletePostRouter: RouteHandler<
	typeof deletePostRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("id"));
		const user = c.get("betterAuthUser");

		const postResult = await db.select().from(posts).where(eq(posts.id, id));
		const post = postResult[0];

		if (!post) {
			return c.json({ error: "Post not found" }, 404);
		}

		if (post.authorId !== user.id) {
			return c.json({ error: "Forbidden" }, 403);
		}

		await db.delete(posts).where(eq(posts.id, id));

		return c.json({ message: "Deleted Successfully!" }, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to delete post", message: getErrorMessage(error) },
			500,
		);
	}
};

export type DeletePostRouterType = typeof deletePostRouter;
