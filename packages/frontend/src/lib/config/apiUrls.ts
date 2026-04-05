import { getApiBaseUrl } from "../api/url/BaseUrl";

const API_PATH = {
	ME: "better-auth/get-session",
	GET_ALL_THREADS: "bbs/threads",
	GET_TRENDING_THREADS: "bbs/threads/trending",
	GET_ALL_DEVELOPER_NOTES: "bbs/developer-notes",
	GET_ALL_DEVELOPER_ROADMAP: "bbs/developer-roadmap",
	SEARCH_THREADS: "bbs/threads/search",
	GET_THREAD_BY_ID: "bbs/threads/",
	CREATE_THREAD: "bbs/threads/create",
	CREATE_DEVELOPER_NOTE: "bbs/developer-notes/create",
	CREATE_DEVELOPER_ROADMAP: "bbs/developer-roadmap/create",
	CREATE_POST: "bbs/posts/create",
	UPLOAD_IMAGE: "bbs/media/upload",
	GET_NOTIFICATIONS: "bbs/notifications",
	GET_NOTIFICATIONS_COUNT: "bbs/notifications/count",
	GET_POSTS_BY_THREADID: "bbs/posts/byThreadId/",
	GET_USER_PROFILE_BY_ID: "bbs/users/",
	GET_PROFILE_PLAYERS: "bbs/users/players",
	READ_ALL_NOTIFICATIONS: "bbs/notifications/read-all",
	UPDATE_MY_PROFILE: "bbs/users/update",
	GET_ALL_TAGS: "bbs/labels",
	GET_REACTION_OPTIONS: "bbs/posts/reactions/available",
	SET_POST_REACTIONS: "bbs/posts/reactions/set",
	SET_THREAD_LIKES: "bbs/threads/likes/set",
} as const;

type ApiPathKey = keyof typeof API_PATH;

export const getApiUrl = async (key: ApiPathKey): Promise<URL> => {
	const baseUrl = getApiBaseUrl();
	return new URL(API_PATH[key], baseUrl);
};
