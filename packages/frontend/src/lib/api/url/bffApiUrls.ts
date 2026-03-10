import { getApiBaseUrl } from "./BaseBffUrl";

export const BFF_API_PATH = {
	SEARCH_THREADS: "threads/api/threads/search",
	CREATE_THREAD: "threads/api/threads/createThread",
	CREATE_DEVELOPER_NOTE: "developer-notes/api/createNote",
	CREATE_POST: "threads/api/posts/createPost",
	GET_POSTS_BY_THREADID: "threads/api/posts/getPostByThreadId/",
	GET_REACTION_OPTIONS: "threads/api/posts/getReactionOptions",
	SET_POST_REACTIONS: "threads/api/posts/setPostReaction",
	SET_THREAD_LIKES: "threads/api/threads/setThreadLike",
	UPLOAD_MY_AVATAR: "threads/api/users/uploadAvatar",
	UPDATE_MY_PROFILE: "threads/api/users/updateProfile",
} as const;

export type BffApiPathKey = keyof typeof BFF_API_PATH;

export const getBffApiUrl = async (key: BffApiPathKey): Promise<URL> => {
	const baseUrl = await getApiBaseUrl();
	return new URL(BFF_API_PATH[key], baseUrl);
};
