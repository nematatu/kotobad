import { OpenAPIHono } from "@hono/zod-openapi";
import { AppEnvironment } from "../../../types";

import { createPostRoute, createPostRouter } from "./methods/create";
import { deletePostRoute, deletePostRouter } from "./methods/delete";
import { editPostRoute, editPostRouter } from "./methods/edit";
import {
	getPostByThreadIdRoute,
	getAllPostRoute,
	getPostByIdRoute,
	searchPostRoute,
	getPostByThreadIdRouter,
	getAllPostRouter,
	getPostByIdRouter,
	searchPostRouter,
} from "./methods/get";

const postRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(createPostRoute, createPostRouter)
	.openapi(deletePostRoute, deletePostRouter)
	.openapi(editPostRoute, editPostRouter)
	.openapi(getPostByThreadIdRoute, getPostByThreadIdRouter)
	.openapi(getAllPostRoute, getAllPostRouter)
	.openapi(getPostByIdRoute, getPostByIdRouter)
	.openapi(searchPostRoute, searchPostRouter);

export default postRouter;
