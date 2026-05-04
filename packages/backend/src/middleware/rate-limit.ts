import { getClientIp } from "@kotobad/shared/src/utils/request/getClientIp";
import { createMiddleware } from "hono/factory";
import type { AppEnvironment } from "../types";

type RateLimitPolicy = {
	windowMs: number;
	maxRequests: number;
};

type RateLimitScope =
	| "auth"
	| "authSensitive"
	| "upload"
	| "createThread"
	| "createPost"
	| "reaction"
	| "search"
	| "notifications"
	| "realtime";

type RateLimitEntry = {
	count: number;
	resetAtMs: number;
};

const RATE_LIMIT_POLICIES: Record<RateLimitScope, RateLimitPolicy> = {
	auth: {
		windowMs: 60 * 1000,
		maxRequests: 120,
	},
	authSensitive: {
		windowMs: 10 * 60 * 1000,
		maxRequests: 20,
	},
	upload: {
		windowMs: 60 * 1000,
		maxRequests: 20,
	},
	createThread: {
		windowMs: 10 * 60 * 1000,
		maxRequests: 10,
	},
	createPost: {
		windowMs: 60 * 1000,
		maxRequests: 30,
	},
	reaction: {
		windowMs: 60 * 1000,
		maxRequests: 120,
	},
	search: {
		windowMs: 60 * 1000,
		maxRequests: 60,
	},
	notifications: {
		windowMs: 60 * 1000,
		maxRequests: 180,
	},
	realtime: {
		windowMs: 60 * 1000,
		maxRequests: 30,
	},
};

const AUTH_SENSITIVE_PATH_MARKERS = [
	"/sign-in",
	"/sign-up",
	"/forget-password",
	"/reset-password",
	"/change-password",
];

const MAX_STORE_SIZE = 5000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanupAtMs = 0;

const cleanupExpiredEntries = (nowMs: number) => {
	if (
		nowMs - lastCleanupAtMs < CLEANUP_INTERVAL_MS &&
		rateLimitStore.size < MAX_STORE_SIZE
	) {
		return;
	}

	lastCleanupAtMs = nowMs;
	for (const [key, entry] of rateLimitStore.entries()) {
		if (entry.resetAtMs <= nowMs) {
			rateLimitStore.delete(key);
		}
	}
};

const resolveRateLimitScope = (
	scope: RateLimitScope,
	pathname: string,
): RateLimitScope => {
	if (scope !== "auth") {
		return scope;
	}

	return AUTH_SENSITIVE_PATH_MARKERS.some((marker) => pathname.includes(marker))
		? "authSensitive"
		: "auth";
};

const getIdentityKeys = ({
	headers,
	scope,
	userId,
}: {
	headers: Headers;
	scope: RateLimitScope;
	userId: string | null;
}) => {
	const ip = getClientIp(headers);
	const keys = [`${scope}:ip:${ip}`];
	if (userId) {
		keys.push(`${scope}:user:${userId}`);
	}
	return keys;
};

const readEntry = (
	storeKey: string,
	policy: RateLimitPolicy,
	nowMs: number,
): RateLimitEntry => {
	const current = rateLimitStore.get(storeKey);
	if (!current || current.resetAtMs <= nowMs) {
		return {
			count: 0,
			resetAtMs: nowMs + policy.windowMs,
		};
	}
	return current;
};

export const backendRateLimitMiddleware = (scope: RateLimitScope) =>
	createMiddleware<AppEnvironment>(async (c, next) => {
		if (c.req.method.toUpperCase() === "OPTIONS") {
			await next();
			return;
		}

		const url = new URL(c.req.url);
		const resolvedScope = resolveRateLimitScope(scope, url.pathname);
		const policy = RATE_LIMIT_POLICIES[resolvedScope];
		const nowMs = Date.now();
		cleanupExpiredEntries(nowMs);

		const keys = getIdentityKeys({
			headers: c.req.raw.headers,
			scope: resolvedScope,
			userId: c.var.betterAuthUser?.id ?? null,
		});

		let retryAfterSeconds = 1;
		for (const key of keys) {
			const entry = readEntry(key, policy, nowMs);
			if (entry.count >= policy.maxRequests) {
				retryAfterSeconds = Math.max(
					1,
					Math.ceil((entry.resetAtMs - nowMs) / 1000),
				);
				c.header("Retry-After", String(retryAfterSeconds));
				c.header("X-RateLimit-Limit", String(policy.maxRequests));
				c.header("X-RateLimit-Remaining", "0");
				c.header(
					"X-RateLimit-Reset",
					String(Math.ceil(entry.resetAtMs / 1000)),
				);
				return c.json(
					{
						error: "Too many requests",
						message:
							"短時間のアクセスが多すぎます。少し待ってから再試行してください。",
					},
					429,
				);
			}
		}

		let remaining = policy.maxRequests;
		let resetAtMs = nowMs + policy.windowMs;
		for (const key of keys) {
			const entry = readEntry(key, policy, nowMs);
			const nextEntry = {
				count: entry.count + 1,
				resetAtMs: entry.resetAtMs,
			};
			rateLimitStore.set(key, nextEntry);
			remaining = Math.min(remaining, policy.maxRequests - nextEntry.count);
			resetAtMs = Math.min(resetAtMs, nextEntry.resetAtMs);
		}

		c.header("X-RateLimit-Limit", String(policy.maxRequests));
		c.header("X-RateLimit-Remaining", String(Math.max(0, remaining)));
		c.header("X-RateLimit-Reset", String(Math.ceil(resetAtMs / 1000)));

		await next();
	});
