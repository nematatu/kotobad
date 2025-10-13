import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnvironment } from "../../types";
import { loginRoute, loginRouter } from "./methods/login";
import { logoutRoute, logoutRouter } from "./methods/logout";
import { MeRoute, MeRouter } from "./methods/me";
import { signupRoute, signupRouter } from "./methods/signup";

const authRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(signupRoute, signupRouter)
	.openapi(loginRoute, loginRouter)
	.openapi(logoutRoute, logoutRouter)
	.openapi(MeRoute, MeRouter);

export default authRouter;
