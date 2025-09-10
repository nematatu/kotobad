import { createRoute, z } from "@hono/zod-openapi";
import {
	OpenAPICreateThreadSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import { ErrorResponse } from "../../../../models/error";
import { threads } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm"; // Import eq for querying
import { RouteHandler } from "@hono/zod-openapi";
import { AppEnvironment } from "../../../../types";

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
	const user = c.get("user");

	console.log(user);
	let validatedData;
	try {
		validatedData = c.req.valid("json");
	} catch (err: any) {
		console.error("Validation error:", err.errors);
		return c.json({ error: "Validation failed", details: err.errors }, 400);
	}
	const { title } = validatedData as z.infer<typeof OpenAPICreateThreadSchema>;

	try {
		const result = await db
			.insert(threads)
			.values({
				title: title,
				authorId: user.id,
				postCount: 0,
			})
			.returning({ id: threads.id });

		console.log(result);
		const newThreadId = result[0].id;

		const createdThreadResult = await db.query.threads.findFirst({
			where: eq(threads.id, newThreadId),
			with: { author: true },
		});

		return c.json(createdThreadResult, 201);
	} catch (e: any) {
		// console.error(e);
		return c.json({ error: "internal server error", message: e.message }, 500);
	}
};

export type CreateThreadRouterType = typeof createThreadRouter;
