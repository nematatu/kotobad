import { OpenAPIHono } from "@hono/zod-openapi";
import { AppEnvironment } from "../../../types";

import { getAllLabelRoute, getAllLabelRouter } from "./methods/get";

const labelRouter = new OpenAPIHono<AppEnvironment>().openapi(
	getAllLabelRoute,
	getAllLabelRouter,
);

export default labelRouter;
