import {
	PostSchema,
	CreatePostSchema,
	PostListSchema,
	EditPostSchema,
} from "../schemas/post";
import { z } from "zod";

export type PostType = z.infer<typeof PostSchema>;

export type CreatePostType = z.infer<typeof CreatePostSchema>;

export type PostListType = z.infer<typeof PostListSchema>;

export type EditPostType = z.infer<typeof EditPostSchema>;
