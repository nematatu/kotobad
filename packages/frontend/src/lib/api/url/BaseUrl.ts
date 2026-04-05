import { ensureTrailingSlash } from "@kotobad/shared/src/utils/url/ensureTrailingSlash";

const env = process.env.NODE_ENV;

const apiUrlMap: Record<
	"production" | "development" | "test",
	string | undefined
> = {
	production: process.env.NEXT_PUBLIC_API_URL_PRODUCT,
	development: process.env.NEXT_PUBLIC_API_URL,
	test: process.env.NEXT_PUBLIC_API_URL,
};

const resolveBaseUrl = () => {
	const raw = apiUrlMap[env];

	if (!raw) {
		throw new Error(
			"NEXT_PUBLIC_API_URL (または NEXT_PUBLIC_API_URL_PRODUCT) が設定されていません。",
		);
	}

	return ensureTrailingSlash(raw);
};

const BASE_URL = resolveBaseUrl();

export const getApiBaseUrl = () => BASE_URL;
