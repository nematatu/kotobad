import { getClientIp } from "@kotobad/shared/src/utils/request/getClientIp";
import { NextResponse } from "next/server";

type RateLimitPolicy = {
	windowMs: number;
	maxRequests: number;
};

type FrontendRateLimitScope =
	| "auth"
	| "authSensitive"
	| "csrf"
	| "upload"
	| "createThread"
	| "createPost"
	| "reaction"
	| "search"
	| "notifications"
	| "read";

type RateLimitEntry = {
	count: number;
	resetAtMs: number;
};

const RATE_LIMIT_POLICIES: Record<FrontendRateLimitScope, RateLimitPolicy> = {
	auth: {
		windowMs: 60 * 1000,
		maxRequests: 120,
	},
	authSensitive: {
		windowMs: 10 * 60 * 1000,
		maxRequests: 20,
	},
	csrf: {
		windowMs: 60 * 1000,
		maxRequests: 120,
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
	read: {
		windowMs: 60 * 1000,
		maxRequests: 240,
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
	scope: FrontendRateLimitScope,
	pathname: string,
): FrontendRateLimitScope => {
	if (scope !== "auth") {
		return scope;
	}

	return AUTH_SENSITIVE_PATH_MARKERS.some((marker) => pathname.includes(marker))
		? "authSensitive"
		: "auth";
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

export const checkFrontendRateLimit = (
	req: Request,
	scope: FrontendRateLimitScope,
): NextResponse | null => {
	if (req.method.toUpperCase() === "OPTIONS") {
		return null;
	}

	const url = new URL(req.url);
	const resolvedScope = resolveRateLimitScope(scope, url.pathname);
	const policy = RATE_LIMIT_POLICIES[resolvedScope];
	const nowMs = Date.now();
	cleanupExpiredEntries(nowMs);

	const ip = getClientIp(req.headers);
	const storeKey = `${resolvedScope}:ip:${ip}`;
	const entry = readEntry(storeKey, policy, nowMs);

	if (entry.count >= policy.maxRequests) {
		const retryAfterSeconds = Math.max(
			1,
			Math.ceil((entry.resetAtMs - nowMs) / 1000),
		);
		return NextResponse.json(
			{
				error: "Too many requests",
				message:
					"短時間のアクセスが多すぎます。少し待ってから再試行してください。",
			},
			{
				status: 429,
				headers: {
					"Retry-After": String(retryAfterSeconds),
					"X-RateLimit-Limit": String(policy.maxRequests),
					"X-RateLimit-Remaining": "0",
					"X-RateLimit-Reset": String(Math.ceil(entry.resetAtMs / 1000)),
				},
			},
		);
	}

	const nextEntry = {
		count: entry.count + 1,
		resetAtMs: entry.resetAtMs,
	};
	rateLimitStore.set(storeKey, nextEntry);

	return null;
};
