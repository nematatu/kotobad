import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";

import { getAllTagRoute, getAllTagRouter } from "./methods/get";

const tagRouter = new OpenAPIHono<AppEnvironment>().openapi(
	getAllTagRoute,
	getAllTagRouter,
);

export default tagRouter;
