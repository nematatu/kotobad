import { Hono } from "hono";
import { db } from "./middleware/db";
import type { AppEnvironment } from "./types";
import { prettyJSON } from "hono/pretty-json";
import mainRouter from "./routes";
import { ZodError } from "zod";
import { HTTPException } from "hono/http-exception";

const app = new Hono<AppEnvironment>()
	.use("*", db)
	.use(prettyJSON())
	.route("/", mainRouter);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.onError((err, c) => {
	if (err instanceof ZodError) {
		const firstError = err.issues[0];
		const errorMessage = `Invalid Input for ${firstError.path.join(".")}: ${firstError.message[0]}}`;
		return c.json(
			{ error: "Validation Error", message: errorMessage, success: false },
			400,
		);
	}
	if (err instanceof HTTPException) {
		return err.getResponse();
	}
	console.error("An unexpected error occured", err);

	if (c.env.APP_ENV === "development") {
		return c.json(
			{
				message: err.message,
				stack: err.stack,
				success: false,
			},
			500,
		);
	}
	return c.json(
		{
			Error: "Error",
			message: "Internal server error",
			success: false,
		},
		500,
	);
});

export type AppType = typeof app;
export default app;
