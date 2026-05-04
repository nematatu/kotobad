import { OpenAPIHono } from "@hono/zod-openapi";
import { betterAuthMiddleware } from "../../middleware/better-auth";
import { backendRateLimitMiddleware } from "../../middleware/rate-limit";
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
	.use("/threads/create", backendRateLimitMiddleware("createThread"))
	.use("/threads/likes/set", betterAuthMiddleware)
	.use("/threads/likes/set", backendRateLimitMiddleware("reaction"))
	.use("/threads/search", backendRateLimitMiddleware("search"))
	.use("/posts/create", betterAuthMiddleware)
	.use("/posts/create", backendRateLimitMiddleware("createPost"))
	.use("/posts/reactions/set", betterAuthMiddleware)
	.use("/posts/reactions/set", backendRateLimitMiddleware("reaction"))
	.use("/notifications", betterAuthMiddleware)
	.use("/notifications/*", betterAuthMiddleware)
	.use("/notifications", backendRateLimitMiddleware("notifications"))
	.use("/notifications/*", backendRateLimitMiddleware("notifications"))
	.use("/users/update", betterAuthMiddleware)
	.use("/users/update", backendRateLimitMiddleware("upload"))
	.use("/users/players", backendRateLimitMiddleware("search"))
	.use("/media/upload", betterAuthMiddleware)
	.use("/media/upload", backendRateLimitMiddleware("upload"))
	.use("/realtime/*", backendRateLimitMiddleware("realtime"))
	.route("/notifications", notificationsRouter)
	.route("/media", mediaRouter)
	.route("/posts", postRouter)
	.route("/threads", threadRouter)
	.route("/users", userRouter)
	.route("/labels", tagRouter)
	.route("/realtime", realtimeRouter);

export default bbsRouter;
