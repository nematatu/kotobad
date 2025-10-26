const ENV = process.env.NODE_ENV;

const ensureTrailingSlash = (value: string): string =>
	value.endsWith("/") ? value : `${value}/`;

const resolveBaseUrl = () => {
	const prodCandidate =
		process.env.NEXT_PUBLIC_API_URL_PRODUCT ?? process.env.NEXT_PUBLIC_API_URL;
	const devCandidate = process.env.NEXT_PUBLIC_API_URL;

	const raw =
		ENV === "production"
			? (prodCandidate ?? "")
			: (devCandidate ?? prodCandidate ?? "");

	if (typeof window !== "undefined" && ENV !== "production") {
		return ensureTrailingSlash(`http://${window.location.hostname}:8787`);
	}
	if (!raw) {
		throw new Error(
			"NEXT_PUBLIC_API_URL (または NEXT_PUBLIC_API_URL_PRODUCT) が設定されていません。",
		);
	}

	return ensureTrailingSlash(raw);
};

const BASE_URL = resolveBaseUrl();

export const getApiBaseUrl = () => BASE_URL;

export const API_PATH = {
	SIGN_UP: "auth/signup",
	LOGIN: "auth/login",
	LOGOUT: "auth/logout",
	ME: "auth/me",
	GET_ALL_THREADS: "bbs/threads",
	CREATE_THREAD: "bbs/threads/create",
	GET_ALL_POSTS: "bbs/posts",
	CREATE_POST: "bbs/posts/create",
	GET_POSTS_BY_THREADID: "bbs/posts/byThreadId",
	GET_ALL_LABELS: "bbs/labels",
} as const;

export type ApiPathKey = keyof typeof API_PATH;

export const getApiUrl = (key: ApiPathKey): URL =>
	new URL(API_PATH[key], BASE_URL);
