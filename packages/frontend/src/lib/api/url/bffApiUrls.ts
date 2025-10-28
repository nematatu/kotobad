import { getApiBaseUrl } from "./BaseBffUrl";

const BASE_URL = getApiBaseUrl();

export const BFF_API_PATH = {
	SIGN_UP: "auth/api/signup",
	LOGIN: "auth/api/login",
	LOGOUT: "auth/api/logout",
	ME: "auth/api/me",
	GET_ALL_THREADS: "threads/api/getAllThreads",
	CREATE_THREAD: "threads/api/createThread",
	GET_ALL_POSTS: "threads/api/getAllPosts",
	CREATE_POST: "threads/api/createPost",
	GET_POSTS_BY_THREADID: "threads/api/getPostByThreadId",
	GET_ALL_LABELS: "threads/api/getAllLabels",
} as const;

export type BffApiPathKey = keyof typeof BFF_API_PATH;

export const getBffApiUrl = (key: BffApiPathKey): URL =>
	new URL(BFF_API_PATH[key], BASE_URL);
