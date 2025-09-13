// import { Hono } from "hono";
import { AppEnvironment } from "../../types";
import { authMiddleware } from "../../middleware/auth";
import threadRouter from "./threads";
import postRouter from "./posts";
import labelRouter from "./labels";
import { OpenAPIHono } from "@hono/zod-openapi";

const bbsRouter = new OpenAPIHono<AppEnvironment>()
	.use("/threads/create", authMiddleware)
	.use("/posts/create", authMiddleware)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/labels", labelRouter);

export type BbsType = typeof bbsRouter;
export default bbsRouter;
