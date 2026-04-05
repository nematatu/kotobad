import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import {
	getUserProfileByIdRoute,
	getUserProfileByIdRouter,
} from "./methods/get";
import {
	getProfileSelectablePlayersRoute,
	getProfileSelectablePlayersRouter,
} from "./methods/players";
import {
	updateUserProfileRoute,
	updateUserProfileRouter,
} from "./methods/update";

const userRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getProfileSelectablePlayersRoute, getProfileSelectablePlayersRouter)
	.openapi(getUserProfileByIdRoute, getUserProfileByIdRouter)
	.openapi(updateUserProfileRoute, updateUserProfileRouter);

export default userRouter;
