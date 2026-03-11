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
import {
	updateDeveloperNoteLabelRoute,
	updateDeveloperNoteLabelRouter,
} from "./methods/updateLabel";

const developerNotesRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(getAllDeveloperNotesRoute, getAllDeveloperNotesRouter)
	.openapi(createDeveloperNoteRoute, createDeveloperNoteRouter)
	.openapi(updateDeveloperNoteLabelRoute, updateDeveloperNoteLabelRouter);

export default developerNotesRouter;
