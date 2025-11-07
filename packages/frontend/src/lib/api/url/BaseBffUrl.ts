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
		const forwardedProto = hdrs.get("x-forwarded-proto");
		const proto =
			forwardedProto ??
			(/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https");
		// bun run previewでローカルプレビューは出来ない！
		// 多分preview環境だとenvがproductionになって、protoがhttpsになってしまう
		// なので、http://locachost:3000/なのに、protoにhttpではなく、httpsになってしまう
		// bun devではenvがdevelopmentなのでprotoがhttpになるから、正常に動く
		// もしローカルプレビューをチェックしたいなら、一時的に${proto}をhttpにハードコードしてチェックできる
		const targetUrl = `${proto}://${host}`;
		return ensureTrailingSlash(
			"https://e9b17f78-kotobad-frontend.amtt.workers.dev/",
		);
		// return ensureTrailingSlash(targetUrl);
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
