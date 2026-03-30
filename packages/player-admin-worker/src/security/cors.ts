import type { Bindings } from "../types";

const parseOrigins = (value?: string) =>
	value
		?.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean) ?? [];

const isLoopbackOrigin = (origin: string): boolean => {
	try {
		const url = new URL(origin);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return false;
		}
		return url.hostname === "localhost" || url.hostname === "127.0.0.1";
	} catch {
		return false;
	}
};

export const resolveCorsOrigin = (origin: string, env: Bindings): string => {
	if (!origin) {
		return "";
	}

	const allowList = parseOrigins(env.ALLOWED_ORIGINS);
	if (allowList.includes(origin)) {
		return origin;
	}

	if (env.APP_ENV !== "production" && isLoopbackOrigin(origin)) {
		return origin;
	}

	return "";
};
