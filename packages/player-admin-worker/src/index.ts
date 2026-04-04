import { Hono } from "hono";
import { cors } from "hono/cors";
import { requireAdminToken } from "./middleware/requireAdminToken";
import { assetsRouter } from "./routes/assets";
import { playersRouter } from "./routes/players";
import { resolveCorsOrigin } from "./security/cors";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

app.use(
	"*",
	cors({
		origin: (origin, c) => resolveCorsOrigin(origin, c.env),
		allowMethods: ["GET", "POST", "PATCH", "PUT", "OPTIONS"],
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"x-admin-token",
			"x-api-key",
		],
	}),
);

app.use("/players", requireAdminToken);
app.use("/players/*", requireAdminToken);

app.route("/players", playersRouter);
app.route("/", assetsRouter);

app.onError((error, c) => {
	console.error(error);
	const message =
		error instanceof Error ? error.message : "unknown_internal_error";
	const includeDetails = c.env.APP_ENV !== "production";
	return c.json(
		includeDetails
			? { error: "internal_server_error", message }
			: { error: "internal_server_error" },
		500,
	);
});

export default app;
