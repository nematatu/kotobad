import { getApiBaseUrl } from "../api/url/BaseUrl";

export const API_PATH = {
	ME: "better-auth/get-session",
	GET_ALL_THREADS: "bbs/threads",
	SEARCH_THREADS: "bbs/threads/search",
	GET_THREAD_BY_ID: "bbs/threads/",
	CREATE_THREAD: "bbs/threads/create",
	CREATE_POST: "bbs/posts/create",
	GET_POSTS_BY_THREADID: "bbs/posts/byThreadId/",
	GET_ALL_TAGS: "bbs/labels",
} as const;

export type ApiPathKey = keyof typeof API_PATH;

export const getApiUrl = async (key: ApiPathKey): Promise<URL> => {
	const baseUrl = getApiBaseUrl();
	return new URL(API_PATH[key], baseUrl);
};
