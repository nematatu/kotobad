import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import { uploadMyAvatarRoute, uploadMyAvatarRouter } from "./methods/avatar";
import {
	getUserProfileByIdRoute,
	getUserProfileByIdRouter,
} from "./methods/get";
import {
	updateUserProfileRoute,
	updateUserProfileRouter,
} from "./methods/update";

const userRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getUserProfileByIdRoute, getUserProfileByIdRouter)
	.openapi(updateUserProfileRoute, updateUserProfileRouter)
	.openapi(uploadMyAvatarRoute, uploadMyAvatarRouter);

export default userRouter;
