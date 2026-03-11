import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import {
	getNotificationsCountRoute,
	getNotificationsCountRouter,
} from "./methods/count";
import { getNotificationsRoute, getNotificationsRouter } from "./methods/get";
import {
	readAllNotificationsRoute,
	readAllNotificationsRouter,
} from "./methods/read-all";

const notificationsRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getNotificationsRoute, getNotificationsRouter)
	.openapi(getNotificationsCountRoute, getNotificationsCountRouter)
	.openapi(readAllNotificationsRoute, readAllNotificationsRouter);

export default notificationsRouter;
