import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import {
	getUserProfileByIdRoute,
	getUserProfileByIdRouter,
} from "./methods/get";

const userRouter = new OpenAPIHono<AppEnvironment>().openapi(
	getUserProfileByIdRoute,
	getUserProfileByIdRouter,
);

export default userRouter;
