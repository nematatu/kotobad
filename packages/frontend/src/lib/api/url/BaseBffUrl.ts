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
		// const forwardedProto = hdrs.get("x-forwarded-proto");
		// const proto =
		// 	forwardedProto ??
		// 	(/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https");

		// bun run previewでローカルプレビューは出来ない！
		// 多分preview環境だとenvがproductionになって、protoがhttpsになってしまう
		// なので、http://locachost:3000/なのに、protoにhttpではなく、httpsになってしまう
		// bun devではenvがdevelopmentなのでprotoがhttpになるから、正常に動く
		// もしローカルプレビューをチェックしたいなら、一時的に${proto}をhttpにハードコードしてチェックできる
		// なんか↑関係ない気がする
		// 普通に環境ごとにプロトコル変更するか

		console.log("process.env.NODE_ENV", process.env.NODE_ENV);
		const proto = process.env.NODE_ENV === "development" ? "http" : "https";

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

	const fallback = ensureTrailingSlash(raw);
	return fallback;
};

export const getApiBaseUrl = resolveBaseUrl;
