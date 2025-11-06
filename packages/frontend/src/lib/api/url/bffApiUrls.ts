import { getApiBaseUrl } from "./BaseBffUrl";

export const BFF_API_PATH = {
	SIGN_UP: "auth/api/signup",
	LOGIN: "auth/api/login",
	LOGOUT: "auth/api/logout",
	ME: "auth/api/me",
	GET_ALL_THREADS: "threads/api/getAllThreads",
	GET_THREAD_BY_ID: "threads/api/getThreadById/",
	CREATE_THREAD: "threads/api/createThread",
	GET_ALL_POSTS: "threads/api/getAllPosts",
	CREATE_POST: "threads/api/createPost",
	GET_POSTS_BY_THREADID: "threads/api/getPostByThreadId",
	GET_ALL_LABELS: "threads/api/getAllLabels",
} as const;

export type BffApiPathKey = keyof typeof BFF_API_PATH;

export const getBffApiUrl = async (key: BffApiPathKey): Promise<URL> => {
	const baseUrl = await getApiBaseUrl();
	return new URL(BFF_API_PATH[key], baseUrl);
};
