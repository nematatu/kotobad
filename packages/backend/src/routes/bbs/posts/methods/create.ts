import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { posts, threads } from "../../../../../drizzle/schema";
import {
	OpenAPICreatePostSchema,
	OpenAPIPostSchema,
} from "../../../../models/posts";
import { RouteHandler } from "@hono/zod-openapi";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { AppEnvironment } from "../../../../types";

export const createPostRoute = createRoute({
	method: "post",
	path: "/create",
	description: "新規投稿の作成",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPICreatePostSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "作成された投稿",
			content: {
				"application/json": {
					schema: OpenAPIPostSchema,
				},
			},
		},
		400: {
			description: "バリデーションエラー",
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

export const createPostRouter: RouteHandler<
	typeof createPostRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const user = c.get("user");

		let validatedData;
		try {
			validatedData = c.req.valid("json");
		} catch (err: any) {
			console.error("Validation error:", err.errors);
			return c.json({ error: "Validation failed" }, 400);
		}

		let { threadId } = validatedData as z.infer<typeof OpenAPICreatePostSchema>;

		threadId = Number(threadId);

		const thread = await db.query.threads.findFirst({
			where: eq(threads.id, threadId),
		});

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		const result = await db
			.insert(posts)
			.values({
				post: validatedData.post,
				authorId: user.id,
				threadId: threadId,
			})
			.returning({ insertedId: posts.id });

		const newPostId = result[0].insertedId;

		const newPostWithAuthor = await db.query.posts.findFirst({
			where: eq(posts.id, newPostId),
			with: { author: true },
		});

		await db
			.update(threads)
			.set({ postCount: thread.postCount + 1, updatedAt: new Date() })
			.where(eq(threads.id, threadId));

		return c.json(newPostWithAuthor, 201);
	} catch (e: any) {
		console.error(e);
		return c.json({ error: "Failed to create post", message: e.message }, 500);
	}
};

export type CreatePostRouterType = typeof createPostRouter;
