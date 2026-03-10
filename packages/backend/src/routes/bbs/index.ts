// import { Hono } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
// import { authMiddleware } from "../../middleware/auth";
import { betterAuthMiddleware } from "../../middleware/better-auth";
import type { AppEnvironment } from "../../types";
import developerNotesRouter from "./developer-notes";
import postRouter from "./posts";
import realtimeRouter from "./realtime";
import tagRouter from "./tags";
import threadRouter from "./threads";
import userRouter from "./users";

// better auth用のミドルウェアを適用
const bbsRouter = new OpenAPIHono<AppEnvironment>()
	.use("/threads/create", betterAuthMiddleware)
	.use("/threads/delete/*", betterAuthMiddleware)
	.use("/threads/edit/*", betterAuthMiddleware)
	.use("/threads/likes/set", betterAuthMiddleware)
	.use("/posts/create", betterAuthMiddleware)
	.use("/posts/delete/*", betterAuthMiddleware)
	.use("/posts/reactions/set", betterAuthMiddleware)
	.use("/developer-notes/create", betterAuthMiddleware)
	.use("/users/update", betterAuthMiddleware)
	.use("/users/me/avatar", betterAuthMiddleware)
	.route("/developer-notes", developerNotesRouter)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/users", userRouter)
	.route("/labels", tagRouter)
	.route("/realtime", realtimeRouter);

export type BbsType = typeof bbsRouter;
export default bbsRouter;
