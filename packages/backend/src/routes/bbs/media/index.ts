import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import { uploadImageRoute, uploadImageRouter } from "./methods/upload";

const mediaRouter = new OpenAPIHono<AppEnvironment>().openapi(
	uploadImageRoute,
	uploadImageRouter,
);

export default mediaRouter;
