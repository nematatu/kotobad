import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import { posts, threads } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPICreatePostSchema,
	OpenAPIPostSchema,
} from "../../../../models/posts";
import type { AppEnvironment } from "../../../../types";
import { getErrorMessage } from "../../../../utils/errors";

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
		const user = c.get("betterAuthUser");

		let validatedData: z.infer<typeof OpenAPICreatePostSchema>;
		try {
			validatedData = c.req.valid("json");
		} catch (error: unknown) {
			if (error instanceof z.ZodError) {
				console.error("Validation error:", error.issues);
			} else {
				console.error("Validation error:", error);
			}
			return c.json({ error: "Validation failed" }, 400);
		}

		let { threadId } = validatedData;

		threadId = Number(threadId);

		const thread = await db.query.threads.findFirst({
			where: eq(threads.id, threadId),
		});

		if (!thread) {
			return c.json({ error: "Thread not found" }, 404);
		}

		let insertedId: number | null = null;
		let attempts = 0;

		while (insertedId === null && attempts < 3) {
			attempts += 1;

			const [{ maxLocalId }] = await db
				.select({
					maxLocalId: sql<number>`coalesce(max(${posts.localId}), 0)`,
				})
				.from(posts)
				.where(eq(posts.threadId, threadId));

			const nextLocalId = (maxLocalId ?? 0) + 1;

			try {
				const result = await db
					.insert(posts)
					.values({
						post: validatedData.post,
						authorId: user.id,
						threadId: threadId,
						localId: nextLocalId,
					})
					.returning({
						insertedId: posts.id,
					});

				insertedId = result[0].insertedId;

				await db
					.update(threads)
					.set({
						postCount: sql`${threads.postCount} + 1`,
						updatedAt: new Date(),
					})
					.where(eq(threads.id, threadId));
			} catch (error: unknown) {
				const message = getErrorMessage(error);

				if (
					message.includes("posts_thread_local_unique") ||
					message.includes("posts.thread_id")
				) {
					continue;
				}

				throw error;
			}
		}

		if (insertedId === null) {
			throw new Error("Failed to allocate post local id");
		}

		const newPostWithAuthor = await db.query.posts.findFirst({
			where: eq(posts.id, insertedId),
			with: { author: true },
		});
		if (!newPostWithAuthor) {
			return c.json(
				{ error: "Failed to create post", message: "Post not found" },
				500,
			);
		}

		return c.json(
			{
				...newPostWithAuthor,
				author: {
					name: newPostWithAuthor.author?.name ?? "",
				},
			},
			201,
		);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{ error: "Failed to create post", message: getErrorMessage(error) },
			500,
		);
	}
};

export type CreatePostRouterType = typeof createPostRouter;
