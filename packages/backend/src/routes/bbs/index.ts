import { OpenAPIHono } from "@hono/zod-openapi";
import { betterAuthMiddleware } from "../../middleware/better-auth";
import type { AppEnvironment } from "../../types";
import mediaRouter from "./media";
import notificationsRouter from "./notifications";
import postRouter from "./posts";
import realtimeRouter from "./realtime";
import tagRouter from "./tags";
import threadRouter from "./threads";
import userRouter from "./users";

// better auth用のミドルウェアを適用
const bbsRouter = new OpenAPIHono<AppEnvironment>()
	.use("/threads/create", betterAuthMiddleware)
	.use("/threads/likes/set", betterAuthMiddleware)
	.use("/posts/create", betterAuthMiddleware)
	.use("/posts/reactions/set", betterAuthMiddleware)
	.use("/notifications", betterAuthMiddleware)
	.use("/notifications/*", betterAuthMiddleware)
	.use("/users/update", betterAuthMiddleware)
	.use("/media/upload", betterAuthMiddleware)
	.route("/notifications", notificationsRouter)
	.route("/media", mediaRouter)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/users", userRouter)
	.route("/labels", tagRouter)
	.route("/realtime", realtimeRouter);

export default bbsRouter;
