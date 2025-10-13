import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";

import { createPostRoute, createPostRouter } from "./methods/create";
import { deletePostRoute, deletePostRouter } from "./methods/delete";
import {
	getAllPostRoute,
	getAllPostRouter,
	getPostByIdRoute,
	getPostByIdRouter,
	getPostByThreadIdRoute,
	getPostByThreadIdRouter,
	searchPostRoute,
	searchPostRouter,
} from "./methods/get";

const postRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(createPostRoute, createPostRouter)
	.openapi(deletePostRoute, deletePostRouter)
	.openapi(getPostByThreadIdRoute, getPostByThreadIdRouter)
	.openapi(getAllPostRoute, getAllPostRouter)
	.openapi(getPostByIdRoute, getPostByIdRouter)
	.openapi(searchPostRoute, searchPostRouter);

export default postRouter;
