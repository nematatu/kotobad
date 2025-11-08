import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "./database";
import type { Bindings } from "./types";

const parseOrigins = (value?: string) =>
	value
		?.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

const resolveBaseUrl = (env: Bindings, request?: Request) => {
	if (env.BETTER_AUTH_URL) {
		return env.BETTER_AUTH_URL;
	}
	if (request) {
		return new URL(request.url).origin;
	}
	return undefined;
};

export const BETTER_AUTH_BASE_PATH = "/better-auth";

type CreateAuthOptions = {
	env: Bindings;
	restRequest?: Request;
};

export const createAuth = ({ env, restRequest }: CreateAuthOptions) => {
	const trustedOrigins = parseOrigins(env.ALLOWED_ORIGINS);
	const baseURL = resolveBaseUrl(env, restRequest);
	const secret = env.BETTER_AUTH_SECRET;

	if (!secret) {
		throw new Error("BETTER_AUTH_SECRET is not configured.");
	}

	return betterAuth({
		secret,
		baseURL,
		basePath: BETTER_AUTH_BASE_PATH,
		trustedOrigins,
		database: drizzleAdapter(createDb(env), {
			provider: "sqlite",
		}),
		emailAndPassword: {
			enabled: true,
		},
	});
};
