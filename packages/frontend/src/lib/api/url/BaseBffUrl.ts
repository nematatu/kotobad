const env = process.env.NODE_ENV;

const apiUrlMap: Record<
	"production" | "development" | "test",
	string | undefined
> = {
	production: process.env.NEXT_PUBLIC_FRONTEND_URL_PRODUCT,
	development: process.env.NEXT_PUBLIC_FRONTEND_URL,
	test: process.env.NEXT_PUBLIC_FRONTEND_URL,
};

const ensureTrailingSlash = (value: string): string =>
	value.endsWith("/") ? value : `${value}/`;

const getClientOrigin = (): string =>
	ensureTrailingSlash(window.location.origin);

const getServerOrigin = async (): Promise<string | null> => {
	try {
		const { headers } = await import("next/headers");
		const hdrs = await headers();
		const host = hdrs.get("host");
		if (!host) return null;
		const proto = hdrs.get("x-forwarded-proto") ?? "https";
		return ensureTrailingSlash(`${proto}://${host}`);
	} catch {
		return null;
	}
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

	return ensureTrailingSlash(raw);
};

export const getApiBaseUrl = resolveBaseUrl;
