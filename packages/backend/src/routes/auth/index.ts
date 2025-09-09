import { OpenAPIHono } from "@hono/zod-openapi";
import { AppEnvironment } from "../../types";

import { signupRoute, signupRouter } from "./methods/signup";
import { loginRoute, loginRouter } from "./methods/login";
import { logoutRoute, logoutRouter } from "./methods/logout";
import { MeRoute, MeRouter } from "./methods/me";

const authRouter = new OpenAPIHono<AppEnvironment>()
	.openapi(signupRoute, signupRouter)
	.openapi(loginRoute, loginRouter)
	.openapi(logoutRoute, logoutRouter)
	.openapi(MeRoute, MeRouter);

export default authRouter;
