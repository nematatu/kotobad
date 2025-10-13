import { eq } from "drizzle-orm";
import { threads } from "../../../../../drizzle/schema";
import { createRoute, z } from "@hono/zod-openapi";
import {
	OpenAPIEditThreadSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../../types";
import { toThreadResponse } from "./transform";

export const editThreadRoute = createRoute({
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
					schema: OpenAPIEditThreadSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新された投稿",
			content: {
				"application/json": {
					schema: OpenAPIThreadSchema,
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

export const editThreadRouter: RouteHandler<
	typeof editThreadRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const id = Number(c.req.param("id"));
		const user = c.get("user");

		const { title } = c.req.valid("json");

		const threadResult = await db
			.select()
			.from(threads)
			.where(eq(threads.id, id));
		const thread = threadResult[0];

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		if (thread.authorId !== user.id) {
			return c.json({ error: "Forbidden" }, 403);
		}

		const result = await db
			.update(threads)
			.set({ title })
			.where(eq(threads.id, id))
			.returning({ id: threads.id });

		const newEdietedThreadId = result[0].id;

		const editThreadResult = await db.query.threads.findFirst({
			where: eq(threads.id, newEdietedThreadId),
			with: {
				author: {
					columns: { username: true },
				},
				threadLabels: {
					with: {
						labels: true,
					},
				},
			},
		});

		if (!editThreadResult) {
			return c.json({ error: "Thread not found" }, 404);
		}

		return c.json(toThreadResponse(editThreadResult), 200);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to edit post", message: e.message }, 500);
	}
};

export type EditThreadRouterType = typeof editThreadRouter;
