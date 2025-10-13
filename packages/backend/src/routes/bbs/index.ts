// import { Hono } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { authMiddleware } from "../../middleware/auth";
import type { AppEnvironment } from "../../types";
import labelRouter from "./labels";
import postRouter from "./posts";
import threadRouter from "./threads";

const bbsRouter = new OpenAPIHono<AppEnvironment>()
	.use("/threads/create", authMiddleware)
	.use("/posts/create", authMiddleware)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/labels", labelRouter);

export type BbsType = typeof bbsRouter;
export default bbsRouter;
