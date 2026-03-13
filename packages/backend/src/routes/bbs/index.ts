// import { Hono } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
// import { authMiddleware } from "../../middleware/auth";
import { betterAuthMiddleware } from "../../middleware/better-auth";
import type { AppEnvironment } from "../../types";
import developerNotesRouter from "./developer-notes";
import developerRoadmapRouter from "./developer-roadmap";
import notificationsRouter from "./notifications";
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
	.use("/developer-notes/:id/label", betterAuthMiddleware)
	.use("/developer-roadmap/create", betterAuthMiddleware)
	.use("/developer-roadmap/:id", betterAuthMiddleware)
	.use("/developer-roadmap/:id/status", betterAuthMiddleware)
	.use("/notifications", betterAuthMiddleware)
	.use("/notifications/*", betterAuthMiddleware)
	.use("/users/update", betterAuthMiddleware)
	.use("/users/me/avatar", betterAuthMiddleware)
	.route("/notifications", notificationsRouter)
	.route("/developer-roadmap", developerRoadmapRouter)
	.route("/developer-notes", developerNotesRouter)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/users", userRouter)
	.route("/labels", tagRouter)
	.route("/realtime", realtimeRouter);

export type BbsType = typeof bbsRouter;
export default bbsRouter;
