const ENV = process.env.NODE_ENV;

const BASE_URL =
	ENV === "production"
		? process.env.NEXT_PUBLIC_API_URL_PRODUCT!
		: process.env.NEXT_PUBLIC_API_URL!;

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

export const getApiUrl = (key: ApiPathKey): string => {
	return `${BASE_URL}${API_PATH[key]}`;
};
