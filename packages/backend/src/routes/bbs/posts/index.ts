import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";

import { createPostRoute, createPostRouter } from "./methods/create";
import { getPostByThreadIdRoute, getPostByThreadIdRouter } from "./methods/get";

import {
	getReactionOptionsRoute,
	getReactionOptionsRouter,
	setPostReactionsRoute,
	setPostReactionsRouter,
} from "./methods/reactions";

const postRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(createPostRoute, createPostRouter)
	.openapi(getReactionOptionsRoute, getReactionOptionsRouter)
	.openapi(getPostByThreadIdRoute, getPostByThreadIdRouter)
	.openapi(setPostReactionsRoute, setPostReactionsRouter);

export default postRouter;
