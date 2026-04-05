import {
	BasePostSchema,
	BaseReactionSchema,
} from "@kotobad/shared/src/schemas";

export const OpenAPIPostSchema =
	BasePostSchema.PostSchema.openapi("PostSchema");

export const OpenAPICreatePostSchema =
	BasePostSchema.CreatePostSchema.openapi("CreatePostSchema");

export const OpenAPIPostListSchema =
	BasePostSchema.PostListSchema.openapi("PostListSchema");

export const OpenAPIPostSetPostReactionsScheme =
	BasePostSchema.SetPostReactionsScheme.openapi("SetPostReactionsScheme");

export const OpenAPIPostSetPostReactionsResponseScheme =
	BasePostSchema.SetPostReactionsResponseSchema.openapi(
		"SetPostReactionsResponseScheme",
	);

export const OpenAPIReactionOptionListSchema =
	BaseReactionSchema.ReactionOptionListSchema.openapi(
		"ReactionOptionListSchema",
	);
