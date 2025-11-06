import { getApiBaseUrl } from "../api/url/BaseUrl";

export const API_PATH = {
	SIGN_UP: "auth/signup",
	LOGIN: "auth/login",
	LOGOUT: "auth/logout",
	ME: "auth/me",
	GET_ALL_THREADS: "bbs/threads",
	GET_THREAD_BY_ID: "bbs/threads/",
	CREATE_THREAD: "bbs/threads/create",
	GET_ALL_POSTS: "bbs/posts",
	CREATE_POST: "bbs/posts/create",
	GET_POSTS_BY_THREADID: "bbs/posts/byThreadId/",
	GET_ALL_LABELS: "bbs/labels",
} as const;

export type ApiPathKey = keyof typeof API_PATH;

export const getApiUrl = async (key: ApiPathKey): Promise<URL> => {
	const baseUrl = await getApiBaseUrl();
	return new URL(API_PATH[key], baseUrl);
};
