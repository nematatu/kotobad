import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../../types";
import {
	createDeveloperNoteRoute,
	createDeveloperNoteRouter,
} from "./methods/create";
import {
	getAllDeveloperNotesRoute,
	getAllDeveloperNotesRouter,
} from "./methods/get";

const developerNotesRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getAllDeveloperNotesRoute, getAllDeveloperNotesRouter)
	.openapi(createDeveloperNoteRoute, createDeveloperNoteRouter);

export default developerNotesRouter;
