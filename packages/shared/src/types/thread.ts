import type { z } from "zod";
import type {
	CreateThreadSchema,
	EditThreadSchema,
	SetThreadLikesResponseSchema,
	SetThreadLikesSchema,
	ThreadListSchema,
	ThreadSchema,
	ThreadWithPostsSchema,
} from "../schemas/thread";

export type ThreadType = z.infer<typeof ThreadSchema>;

export type CreateThreadType = z.infer<typeof CreateThreadSchema>;

export type ThreadListType = z.infer<typeof ThreadListSchema>;

export type EditThreadType = z.infer<typeof EditThreadSchema>;

export type ThreadWithPostsType = z.infer<typeof ThreadWithPostsSchema>;

export type SetThreadLikeType = z.infer<typeof SetThreadLikesSchema>;

export type SetThreadLikeResponseType = z.infer<
	typeof SetThreadLikesResponseSchema
>;
