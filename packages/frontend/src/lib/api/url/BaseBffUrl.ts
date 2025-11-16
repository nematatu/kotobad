import { ensureTrailingSlash } from "../../../utils/url/ensureTrailingSlash";
import { getClientOrigin } from "./clientOrigin";
import { getServerOrigin } from "./serverOrigin";

const env = process.env.NODE_ENV;

export const apiUrlMap: Record<
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

	const raw = apiUrlMap[env];
	if (!raw) {
		throw new Error(
			"NEXT_PUBLIC_FRONTEND_URL (または NEXT_PUBLIC_FRONTEND_URL_PRODUCT) が設定されていません。",
		);
	}

	const fallback = ensureTrailingSlash(raw);
	return fallback;
};

export const getApiBaseUrl = resolveBaseUrl;
