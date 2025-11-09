import { getApiBaseUrl } from "./BaseBffUrl";

export const BFF_API_PATH = {
	SIGN_UP: "auth/api/sign-up/email",
	LOGIN: "auth/api/sign-in/email",
	LOGOUT: "auth/api/sign-out",
	ME: "auth/api/get-session",
	GET_ALL_THREADS: "threads/api/threads/getAllThreads",
	GET_THREAD_BY_ID: "threads/api/threads/getThreadById/",
	CREATE_THREAD: "threads/api/threads/createThread",
	GET_ALL_POSTS: "threads/api/posts/getAllPosts",
	CREATE_POST: "threads/api/posts/createPost",
	GET_POSTS_BY_THREADID: "threads/api/posts/getPostByThreadId/",
	GET_ALL_LABELS: "threads/api/getAllLabels",
} as const;

export type BffApiPathKey = keyof typeof BFF_API_PATH;

export const getBffApiUrl = async (key: BffApiPathKey): Promise<URL> => {
	const baseUrl = await getApiBaseUrl();
	return new URL(BFF_API_PATH[key], baseUrl);
};
