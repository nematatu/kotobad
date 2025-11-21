import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "./database";
import type { Bindings } from "./types";

const parseOrigins = (value?: string) =>
	value
		?.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean) ?? [];

const buildPreviewOriginMatcher = (suffix: string) => {
	const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^[0-9a-f]+${escaped}$`);
};

const maybeAddPreviewOrigin = (
	env: Bindings,
	restRequest: Request | undefined,
	allowList: string[] = [],
) => {
	const allowPreview = env.ALLOW_CF_PAGES_PREVIEW === "true";
	if (!allowPreview || !restRequest) {
		return allowList;
	}
	const origin = restRequest.headers.get("origin");
	if (!origin) {
		return allowList;
	}
	const suffix =
		env.CF_PAGES_PREVIEW_SUFFIX ?? "-kotobad-frontend.amtt.workers.dev";
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:") {
			return allowList;
		}
		const matcher = buildPreviewOriginMatcher(suffix);
		if (matcher.test(url.hostname)) {
			return allowList.includes(origin) ? allowList : [...allowList, origin];
		}
		return allowList;
	} catch {
		return allowList;
	}
};

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
	const effectiveOrigins = maybeAddPreviewOrigin(
		env,
		restRequest,
		trustedOrigins,
	);
	const baseURL = resolveBaseUrl(env, restRequest);
	const secret = env.BETTER_AUTH_SECRET;

	if (!secret) {
		throw new Error("BETTER_AUTH_SECRET is not configured.");
	}

	return betterAuth({
		secret,
		baseURL,
		basePath: BETTER_AUTH_BASE_PATH,
		trustedOrigins: effectiveOrigins,
		database: drizzleAdapter(createDb(env), {
			provider: "sqlite",
		}),
		emailAndPassword: {
			enabled: true,
		},
		// advanced: {
		// 	crossSubDomainCookies: {
		// 		enabled: true,
		// 		domain: ".kotobad.com",
		// 	},
		// 	useSecureCookies: true,
		// },
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},
	});
};
