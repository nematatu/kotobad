import { BasePostSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIPostSchema =
	BasePostSchema.PostSchema.openapi("PostSchema");

export const OpenAPICreatePostSchema =
	BasePostSchema.CreatePostSchema.openapi("CreatePostSchema");

export const OpenAPIEditPostSchema =
	BasePostSchema.EditPostSchema.openapi("EditPostSchema");

export const OpenAPIPostListSchema =
	BasePostSchema.PostListSchema.openapi("PostListSchema");
