import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import {
	createDeveloperRoadmapRoute,
	createDeveloperRoadmapRouter,
} from "./methods/create";
import {
	getAllDeveloperRoadmapRoute,
	getAllDeveloperRoadmapRouter,
} from "./methods/get";
import {
	updateDeveloperRoadmapItemRoute,
	updateDeveloperRoadmapItemRouter,
} from "./methods/update";

const developerRoadmapRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getAllDeveloperRoadmapRoute, getAllDeveloperRoadmapRouter)
	.openapi(createDeveloperRoadmapRoute, createDeveloperRoadmapRouter)
	.openapi(updateDeveloperRoadmapItemRoute, updateDeveloperRoadmapItemRouter);

export default developerRoadmapRouter;
