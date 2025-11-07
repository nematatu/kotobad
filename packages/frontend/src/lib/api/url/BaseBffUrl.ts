import { ensureTrailingSlash } from "../../../utils/url/ensureTrailingSlash";
import { getClientOrigin } from "./clientOrigin";
import { getServerOrigin } from "./serverOrigin";

const env = process.env.NODE_ENV;

const apiUrlMap: Record<
	"production" | "development" | "test",
	string | undefined
> = {
	production: process.env.NEXT_PUBLIC_FRONTEND_URL_PRODUCT,
	development: process.env.NEXT_PUBLIC_FRONTEND_URL,
	test: process.env.NEXT_PUBLIC_FRONTEND_URL,
};

export const resolveBaseUrl = async (): Promise<string> => {
	if (typeof window !== "undefined") {
		return getClientOrigin();
	}

	const origin = await getServerOrigin();
	if (origin) {
		return origin;
	}

	console.log("origin", origin);
	const raw = apiUrlMap[env];
	console.log("raw", raw);
	if (!raw) {
		throw new Error(
			"NEXT_PUBLIC_FRONTEND_URL (または NEXT_PUBLIC_FRONTEND_URL_PRODUCT) が設定されていません。",
		);
	}

	console.log("2raw", raw);
	const fallback = ensureTrailingSlash(raw);
	console.log("fallback", fallback);
	return fallback;
};

export const getApiBaseUrl = resolveBaseUrl;
