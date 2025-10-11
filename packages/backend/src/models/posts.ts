import { BasePostSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIPostSchema = BasePostSchema.PostSchema.openapi(
	"PostSchema",
	{
		description: "ポストスキーマ",
		example: {
			id: 1,
			localId: 1,
			title: "Honoはいいぞ",
			description: "Honoは速くて使いやすい",
			authorId: 1,
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z",
			author: {
				username: "user",
			},
		},
	},
);

export const OpenAPICreatePostSchema =
	BasePostSchema.CreatePostSchema.openapi("CreatePostSchema");

export const OpenAPIEditPostSchema =
	BasePostSchema.EditPostSchema.openapi("EditPostSchema");

export const OpenAPIPostListSchema =
	BasePostSchema.PostListSchema.openapi("PostListSchema");
