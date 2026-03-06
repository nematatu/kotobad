import { getApiBaseUrl } from "../api/url/BaseUrl";

export const API_PATH = {
	ME: "better-auth/get-session",
	GET_ALL_THREADS: "bbs/threads",
	SEARCH_THREADS: "bbs/threads/search",
	GET_THREAD_BY_ID: "bbs/threads/",
	CREATE_THREAD: "bbs/threads/create",
	CREATE_POST: "bbs/posts/create",
	GET_POSTS_BY_THREADID: "bbs/posts/byThreadId/",
	GET_USER_PROFILE_BY_ID: "bbs/users/",
	UPLOAD_MY_AVATAR: "bbs/users/me/avatar",
	UPDATE_MY_PROFILE: "bbs/users/update",
	GET_ALL_TAGS: "bbs/labels",
	GET_REACTION_OPTIONS: "bbs/posts/reactions/available",
	SET_POST_REACTIONS: "bbs/posts/reactions/set",
	SET_THREAD_LIKES: "bbs/threads/likes/set",
	GET_THREAD_REPLY_NOTIFICATIONS: "bbs/posts/notifications/replies",
	SET_THREAD_REPLY_PUSH_SUBSCRIPTION: "bbs/posts/notifications/subscriptions",
} as const;

export type ApiPathKey = keyof typeof API_PATH;

export const getApiUrl = async (key: ApiPathKey): Promise<URL> => {
	const baseUrl = getApiBaseUrl();
	return new URL(API_PATH[key], baseUrl);
};
