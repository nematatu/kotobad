import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { eq } from "drizzle-orm";
import { threads, threadTags } from "../../../../../drizzle/schema";
import { ErrorResponse } from "../../../../models/error";
import {
	OpenAPICreateThreadSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import type { AppEnvironment } from "../../../../types";
import { toThreadResponse } from "./transform";

export const createThreadRoute = createRoute({
	method: "post",
	path: "/create",
	description: "新規スレッド作成",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPICreateThreadSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "作成されたスレッド",
			content: {
				"application/json": {
					schema: OpenAPIThreadSchema,
				},
			},
		},
		400: {
			description: "サーバーエラー",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
						details: z.string(),
					}),
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

export const createThreadRouter: RouteHandler<
	typeof createThreadRoute,
	AppEnvironment
> = async (c) => {
	const db = c.get("db");
	const user = c.get("betterAuthUser");

	let validatedData: z.infer<typeof OpenAPICreateThreadSchema>;
	try {
		validatedData = c.req.valid("json");
	} catch (error: unknown) {
		const details =
			error instanceof z.ZodError
				? JSON.stringify(error.issues)
				: getErrorMessage(error);
		console.error("Validation error:", details);
		return c.json({ error: "Validation failed", details }, 400);
	}
	const { title, tagIds } = validatedData;

	try {
		const result = await db
			.insert(threads)
			.values({
				title: title,
				authorId: user.id,
			})
			.returning({ id: threads.id });

		const newThreadId = result[0].id;
		const uniqueTagIds = Array.from(new Set(tagIds));

		if (uniqueTagIds.length > 0) {
			await db.insert(threadTags).values(
				uniqueTagIds.map((tagId) => ({
					threadId: newThreadId,
					tagId,
				})),
			);
		}

		const createdThreadResult = await db.query.threads.findFirst({
			where: eq(threads.id, newThreadId),
			with: {
				author: {
					columns: { name: true },
				},
				threadTags: {
					with: {
						tags: true,
					},
				},
			},
		});

		if (!createdThreadResult) {
			return c.json(
				{ error: "Thread not found after creation", details: "" },
				400,
			);
		}

		return c.json(toThreadResponse(createdThreadResult), 201);
	} catch (error: unknown) {
		return c.json(
			{
				error: "internal server error",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};

export type CreateThreadRouterType = typeof createThreadRouter;
