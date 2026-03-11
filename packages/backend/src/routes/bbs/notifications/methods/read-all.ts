import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { and, eq, isNull } from "drizzle-orm";
import { notifications } from "../../../../../drizzle/schema";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import { OpenAPINotificationReadAllResponseSchema } from "../../../../models/notifications";
import type { AppEnvironment } from "../../../../types";

export const readAllNotificationsRoute = createRoute({
	method: "post",
	path: "/read-all",
	description: "通知をすべて既読にする",
	responses: {
		200: {
			description: "既読化結果",
			content: {
				"application/json": {
					schema: OpenAPINotificationReadAllResponseSchema,
				},
			},
		},
		401: {
			description: "未認証",
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

export const readAllNotificationsRouter: RouteHandler<
	typeof readAllNotificationsRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const currentUser = c.get("betterAuthUser");

		if (!currentUser?.id) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		await db
			.update(notifications)
			.set({
				readAt: new Date(),
			})
			.where(
				and(
					eq(notifications.recipientUserId, currentUser.id),
					isNull(notifications.readAt),
				),
			);

		return c.json({ success: true }, 200);
	} catch (error: unknown) {
		console.error("Failed to mark notifications as read", error);
		return c.json(
			{
				error: "Failed to mark notifications as read",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
