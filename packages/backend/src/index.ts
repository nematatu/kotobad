import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";
import { ZodError } from "zod";
import { createDb } from "./database";
import { db } from "./middleware/db";
import { ThreadRoom } from "./realtime/thread-room";
import mainRouter from "./routes";
import { refreshThreadTrends } from "./routes/bbs/threads/methods/trending";
import type { AppEnvironment } from "./types";
import { formatZodValidationError } from "./utils/formatZodValidationError";

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
		const errorMessage = formatZodValidationError(err);
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

const worker = {
	fetch: app.fetch,
	async scheduled(
		_controller: ScheduledController,
		env: AppEnvironment["Bindings"],
		ctx: ExecutionContext,
	) {
		ctx.waitUntil(
			(async () => {
				try {
					const db = createDb(env);
					const updatedCount = await refreshThreadTrends({ db });
					console.info(`[cron] refreshThreadTrends updated=${updatedCount}`);
				} catch (error) {
					console.error("[cron] refreshThreadTrends failed", error);
				}
			})(),
		);
	},
} satisfies ExportedHandler<AppEnvironment["Bindings"]>;

export { ThreadRoom };
export type AppType = typeof app;
export default worker;
