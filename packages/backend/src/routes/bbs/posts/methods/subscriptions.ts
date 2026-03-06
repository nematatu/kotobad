import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { SetThreadReplyPushSubscriptionResponseSchema } from "@kotobad/shared/src/schemas/post";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { ErrorResponse, SimpleErrorResponse } from "../../../../models/error";
import {
	OpenAPISetThreadReplyPushSubscriptionResponseSchema,
	OpenAPISetThreadReplyPushSubscriptionSchema,
} from "../../../../models/posts";
import type { AppEnvironment } from "../../../../types";
import {
	removeThreadReplyPushSubscription,
	upsertThreadReplyPushSubscription,
} from "./thread-reply-push";

export const setThreadReplyPushSubscriptionRoute = createRoute({
	method: "post",
	path: "/notifications/subscriptions",
	description: "返信通知のPush購読情報を登録・更新します",
	request: {
		body: {
			content: {
				"application/json": {
					schema: OpenAPISetThreadReplyPushSubscriptionSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "購読状態",
			content: {
				"application/json": {
					schema: OpenAPISetThreadReplyPushSubscriptionResponseSchema,
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

export const setThreadReplyPushSubscriptionRouter: RouteHandler<
	typeof setThreadReplyPushSubscriptionRoute,
	AppEnvironment
> = async (c) => {
	try {
		const user = c.get("betterAuthUser");
		const { active, subscription } = c.req.valid("json");

		if (active) {
			await upsertThreadReplyPushSubscription({
				env: c.env,
				userId: user.id,
				subscription,
			});
		} else {
			await removeThreadReplyPushSubscription({
				env: c.env,
				userId: user.id,
				endpoint: subscription.endpoint,
			});
		}

		const response = SetThreadReplyPushSubscriptionResponseSchema.parse({
			active,
		});
		return c.json(response, 200);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to set thread reply push subscription",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
