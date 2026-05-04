import { getClientIp } from "@kotobad/shared/src/utils/request/getClientIp";
import { createMiddleware } from "hono/factory";
import type { AppEnvironment } from "../types";

type TurnstileScope = "auth" | "authSensitive";

type TurnstileSiteverifyResponse = {
	success: boolean;
	hostname?: string;
	"error-codes"?: string[];
};

const TURNSTILE_SITEVERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TOKEN_HEADER = "x-turnstile-token";
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const AUTH_SENSITIVE_PATH_MARKERS = [
	"/sign-in",
	"/sign-up",
	"/forget-password",
	"/reset-password",
	"/change-password",
];

const parseCsv = (value: string | undefined) =>
	value
		?.split(",")
		.map((item) => item.trim())
		.filter(Boolean) ?? [];

const resolveScope = (scope: TurnstileScope, pathname: string) => {
	if (scope !== "auth") {
		return scope;
	}
	return AUTH_SENSITIVE_PATH_MARKERS.some((marker) => pathname.includes(marker))
		? "authSensitive"
		: "auth";
};

const isScopeEnforced = (
	env: AppEnvironment["Bindings"],
	scope: TurnstileScope,
) => {
	const scopes = parseCsv(env.TURNSTILE_ENFORCE_SCOPES);
	return scopes.includes("*") || scopes.includes(scope);
};

const isHostnameAllowed = (
	env: AppEnvironment["Bindings"],
	hostname: string | undefined,
) => {
	const allowedHostnames = parseCsv(env.TURNSTILE_ALLOWED_HOSTNAMES);
	if (allowedHostnames.length === 0) {
		return true;
	}
	return typeof hostname === "string" && allowedHostnames.includes(hostname);
};

const toSiteverifyResponse = (
	value: unknown,
): TurnstileSiteverifyResponse | null => {
	if (typeof value !== "object" || value === null) {
		return null;
	}
	const record = value as Record<string, unknown>;
	return {
		success: record.success === true,
		hostname: typeof record.hostname === "string" ? record.hostname : undefined,
		"error-codes": Array.isArray(record["error-codes"])
			? record["error-codes"].filter(
					(item): item is string => typeof item === "string",
				)
			: undefined,
	};
};

export const turnstileMiddleware = (scope: TurnstileScope) =>
	createMiddleware<AppEnvironment>(async (c, next) => {
		if (c.req.method.toUpperCase() === "OPTIONS") {
			await next();
			return;
		}

		const url = new URL(c.req.url);
		const resolvedScope = resolveScope(scope, url.pathname);
		if (!isScopeEnforced(c.env, resolvedScope)) {
			await next();
			return;
		}

		const secret = c.env.TURNSTILE_SECRET_KEY;
		if (!secret) {
			return c.json({ error: "Turnstile is not configured" }, 500);
		}

		const token = c.req.raw.headers.get(TURNSTILE_TOKEN_HEADER);
		if (!token || token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
			return c.json({ error: "Turnstile verification required" }, 403);
		}

		const body = new URLSearchParams({
			secret,
			response: token,
			idempotency_key: crypto.randomUUID(),
		});
		const remoteIp = getClientIp(c.req.raw.headers);
		if (remoteIp !== "unknown") {
			body.set("remoteip", remoteIp);
		}

		let siteverify: TurnstileSiteverifyResponse | null = null;
		try {
			const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body,
			});
			siteverify = toSiteverifyResponse(await response.json());
		} catch {
			return c.json({ error: "Turnstile verification unavailable" }, 503);
		}

		if (
			!siteverify?.success ||
			!isHostnameAllowed(c.env, siteverify.hostname)
		) {
			return c.json({ error: "Turnstile verification failed" }, 403);
		}

		await next();
	});
