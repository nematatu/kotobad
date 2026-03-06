import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";

import { createPostRoute, createPostRouter } from "./methods/create";
import { deletePostRoute, deletePostRouter } from "./methods/delete";
import {
	getPostByIdRoute,
	getPostByIdRouter,
	getPostByThreadIdRoute,
	getPostByThreadIdRouter,
	searchPostRoute,
	searchPostRouter,
} from "./methods/get";
import {
	getThreadReplyNotificationsRoute,
	getThreadReplyNotificationsRouter,
} from "./methods/notifications";
import {
	getReactionOptionsRoute,
	getReactionOptionsRouter,
	setPostReactionsRoute,
	setPostReactionsRouter,
} from "./methods/reactions";
import {
	setThreadReplyPushSubscriptionRoute,
	setThreadReplyPushSubscriptionRouter,
} from "./methods/subscriptions";

const postRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(createPostRoute, createPostRouter)
	.openapi(deletePostRoute, deletePostRouter)
	.openapi(getReactionOptionsRoute, getReactionOptionsRouter)
	.openapi(getPostByThreadIdRoute, getPostByThreadIdRouter)
	.openapi(getThreadReplyNotificationsRoute, getThreadReplyNotificationsRouter)
	.openapi(
		setThreadReplyPushSubscriptionRoute,
		setThreadReplyPushSubscriptionRouter,
	)
	.openapi(getPostByIdRoute, getPostByIdRouter)
	.openapi(searchPostRoute, searchPostRouter)
	.openapi(setPostReactionsRoute, setPostReactionsRouter);

export default postRouter;
