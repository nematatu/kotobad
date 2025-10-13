import { createRoute, z } from "@hono/zod-openapi";
import {
	OpenAPICreateThreadSchema,
	OpenAPIThreadSchema,
} from "../../../../models/threads";
import { ErrorResponse } from "../../../../models/error";
import { threads } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { RouteHandler } from "@hono/zod-openapi";
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
	const user = c.get("user");

	let validatedData;
	try {
		validatedData = c.req.valid("json");
	} catch (err: any) {
		const details =
			err instanceof z.ZodError
				? JSON.stringify(err.issues)
				: (err?.message ?? "Invalid payload");
		console.error("Validation error:", details);
		return c.json({ error: "Validation failed", details }, 400);
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

		const newThreadId = result[0].id;

		const createdThreadResult = await db.query.threads.findFirst({
			where: eq(threads.id, newThreadId),
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

		if (!createdThreadResult) {
			return c.json(
				{ error: "Thread not found after creation", details: "" },
				400,
			);
		}

		return c.json(toThreadResponse(createdThreadResult), 201);
	} catch (e: any) {
		return c.json({ error: "internal server error", message: e.message }, 500);
	}
};

export type CreateThreadRouterType = typeof createThreadRouter;
