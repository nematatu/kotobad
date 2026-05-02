import { getApiBaseUrl } from "./BaseBffUrl";

const BFF_API_PATH = {
	CREATE_THREAD: "threads/api/threads/createThread",
	CREATE_POST: "threads/api/posts/createPost",
	UPLOAD_IMAGE: "threads/api/media/upload",
	GET_POSTS_BY_THREADID: "threads/api/posts/getPostByThreadId/",
	GET_REACTION_OPTIONS: "threads/api/posts/getReactionOptions",
	SET_POST_REACTIONS: "threads/api/posts/setPostReaction",
	SET_THREAD_LIKES: "threads/api/threads/setThreadLike",
	UPDATE_MY_PROFILE: "threads/api/users/updateProfile",
	GET_PROFILE_PLAYERS: "threads/api/users/players",
	GET_NOTIFICATIONS: "threads/api/notifications",
	GET_NOTIFICATIONS_COUNT: "threads/api/notifications/count",
	READ_ALL_NOTIFICATIONS: "threads/api/notifications/readAll",
	CSRF_TOKEN: "threads/api/csrf-token",
} as const;

type BffApiPathKey = keyof typeof BFF_API_PATH;

export const getBffApiUrl = async (key: BffApiPathKey): Promise<URL> => {
	const baseUrl = await getApiBaseUrl();
	return new URL(BFF_API_PATH[key], baseUrl);
};
