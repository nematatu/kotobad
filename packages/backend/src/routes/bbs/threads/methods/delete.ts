import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import { threads } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { AppEnvironment } from "../../../../types";

export const deleteThreadRoute = createRoute({
	method: "delete",
	path: "/delete/{id}",
	description: "スレッドを削除",
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

export const deleteThreadRouter: RouteHandler<
	typeof deleteThreadRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("id"));
		const user = c.get("betterAuthUser");

		const threadsResult = await db
			.select()
			.from(threads)
			.where(eq(threads.id, id));
		const result = threadsResult[0];

		if (!result) {
			return c.json({ error: "Thread not found" }, 404);
		}

		if (result.authorId !== user.id) {
			return c.json({ error: "Forbidden" }, 403);
		}

		await db.delete(threads).where(eq(threads.id, id));

		return c.json({ message: "Deleted Successfully!" }, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to delete post", message: getErrorMessage(error) },
			500,
		);
	}
};

export type DeleteThreadRouterType = typeof deleteThreadRouter;
