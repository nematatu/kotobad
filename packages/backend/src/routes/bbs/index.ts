// import { Hono } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
// import { authMiddleware } from "../../middleware/auth";
import { betterAuthMiddleware } from "../../middleware/better-auth";
import type { AppEnvironment } from "../../types";
import postRouter from "./posts";
import tagRouter from "./tags";
import threadRouter from "./threads";
import userRouter from "./users";

// better auth用のミドルウェアを適用
const bbsRouter = new OpenAPIHono<AppEnvironment>()
	.use("/threads/create", betterAuthMiddleware)
	.use("/threads/delete/*", betterAuthMiddleware)
	.use("/threads/edit/*", betterAuthMiddleware)
	.use("/posts/create", betterAuthMiddleware)
	.use("/posts/delete/*", betterAuthMiddleware)
	.use("/posts/reactions/set", betterAuthMiddleware)
	.use("/users/update", betterAuthMiddleware)
	.use("/users/me/avatar", betterAuthMiddleware)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/users", userRouter)
	.route("/labels", tagRouter);

export type BbsType = typeof bbsRouter;
export default bbsRouter;
