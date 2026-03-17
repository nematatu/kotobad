import type { PostType } from "@kotobad/shared/src/types/post";

export type FlattenedPostItem = {
	post: PostType;
	depth: number;
};
