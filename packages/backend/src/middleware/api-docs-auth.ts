import { basicAuth } from "hono/basic-auth";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "../types";

type ApiDocsBindings = Pick<
	Bindings,
	"API_DOCS_USERNAME" | "API_DOCS_PASSWORD"
>;

type ApiDocsEnvironment = {
	Bindings: ApiDocsBindings;
};

export type ApiDocsCredentials = {
	username: string;
	password: string;
};

export const resolveApiDocsCredentials = (
	env: ApiDocsBindings,
): ApiDocsCredentials | null => {
	const { API_DOCS_USERNAME: username, API_DOCS_PASSWORD: password } = env;

	if (!username || !password) return null;

	return { username, password };
};

export const apiDocsAuthMiddleware = createMiddleware<ApiDocsEnvironment>(
	async (c, next) => {
		const credentials = resolveApiDocsCredentials(c.env);

		if (!credentials) {
			return c.json(
				{ error: "API documentation authentication is not configured" },
				503,
			);
		}

		return basicAuth(credentials)(c, next);
	},
);
