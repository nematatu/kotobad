import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";

import { createThreadRoute, createThreadRouter } from "./methods/create";
import { deleteThreadRoute, deleteThreadRouter } from "./methods/delete";
import { editThreadRoute, editThreadRouter } from "./methods/edit";
import {
	getAllThreadRoute,
	getAllThreadRouter,
	getThreadByIdRoute,
	getThreadByIdRouter,
	searchThreadRoute,
	searchThreadRouter,
} from "./methods/get";

const threadRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getAllThreadRoute, getAllThreadRouter)
	.openapi(getThreadByIdRoute, getThreadByIdRouter)
	.openapi(searchThreadRoute, searchThreadRouter)
	.openapi(createThreadRoute, createThreadRouter)
	.openapi(deleteThreadRoute, deleteThreadRouter)
	.openapi(editThreadRoute, editThreadRouter);

export default threadRouter;
