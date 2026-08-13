import { INTERNAL_AUTH_HEADERS } from "@kotobad/shared/src/const/internalAuthHeaders";
import { signHmac } from "@kotobad/shared/src/utils/internalAuth/signHmac";
import { createMiddleware } from "hono/factory";
import type { AppEnvironment } from "../types";

type InternalAuthEnvironment = {
	Bindings: Pick<AppEnvironment["Bindings"], "INTERNAL_API_SECRET">;
};

const ALLOWED_SKEW_MS = 60_000;

const timingSafeEqual = (a: string, b: string): boolean => {
	if (a.length !== b.length) return false;

	let diff = 0;
	for (let i = 0; i < a.length; i++) {
		diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return diff === 0;
};

export const internalAuthMiddleware = createMiddleware<InternalAuthEnvironment>(
	async (c, next) => {
		const secret = c.env.INTERNAL_API_SECRET;
		if (!secret) throw new Error("INTERNAL_API_SECRET is not configured");

		const method = c.req.method.toUpperCase();
		const url = new URL(c.req.url);

		if (method === "OPTIONS") return next();
		if (url.pathname.startsWith("/bbs/realtime/")) return next();

		const ts = c.req.header(INTERNAL_AUTH_HEADERS.TS);
		const sig = c.req.header(INTERNAL_AUTH_HEADERS.SIG);

		if (!ts || !sig) return c.json({ error: "Unauthorized" }, 403);

		const tsNum = Number(ts);
		if (!Number.isFinite(tsNum)) return c.json({ error: "Unauthorized" }, 403);
		if (Math.abs(Date.now() - tsNum) > ALLOWED_SKEW_MS)
			return c.json({ error: "Unauthorized" }, 403);

		const payload = `${method}\n${url.pathname}${url.search}\n${ts}`;
		const expectedSig = await signHmac(secret, payload);

		if (!timingSafeEqual(sig, expectedSig))
			return c.json({ error: "Forbidden" }, 403);

		return next();
	},
);
