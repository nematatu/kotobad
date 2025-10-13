import type { z } from "zod";
import type {
	CreatePostSchema,
	EditPostSchema,
	PostListSchema,
	PostSchema,
} from "../schemas/post";

export type PostType = z.infer<typeof PostSchema>;

export type CreatePostType = z.infer<typeof CreatePostSchema>;

export type PostListType = z.infer<typeof PostListSchema>;

export type EditPostType = z.infer<typeof EditPostSchema>;
