// import { Hono } from "hono";
import { AppEnvironment } from "../../types";
import { authMiddleware } from "../../middleware/auth";
import threadRouter from "./threads";
import postRouter from "./posts";
import { OpenAPIHono } from "@hono/zod-openapi";

const bbsRouter = new OpenAPIHono<AppEnvironment>()
	.use("/threads/create", authMiddleware)
	.route("/posts", postRouter)
	.route("/threads", threadRouter);

export type BbsType = typeof bbsRouter;
export default bbsRouter;
