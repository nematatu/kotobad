import type { AppEnvironment } from "../types";

const parseOrigins = (value?: string) =>
	(value ?? "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const CF_PAGES_PREVIEW_SUFFIX = "-kotobad-frontend.amtt.workers.dev";

export const isAllowedOrigin = (
	origin: string,
	env: Pick<AppEnvironment["Bindings"], "ALLOWED_ORIGINS">,
): boolean => {
	const allowedOrigins = parseOrigins(env.ALLOWED_ORIGINS);
	if (allowedOrigins.includes(origin)) {
		return true;
	}
	const previewHostnamePattern = new RegExp(
		`^[0-9a-f]+${escapeRegex(CF_PAGES_PREVIEW_SUFFIX)}$`,
	);
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:") {
			return false;
		}
		return previewHostnamePattern.test(url.hostname);
	} catch {
		return false;
	}
};
