import { BaseThreadSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIThreadSchema =
	BaseThreadSchema.ThreadSchema.openapi("ThreadSchema");

export const OpenAPICreateThreadSchema =
	BaseThreadSchema.CreateThreadSchema.openapi("CreateThreadSchema");
export const OpenAPIThreadListSchema =
	BaseThreadSchema.ThreadListSchema.openapi("ThreadListSchema");
export const OpenAPISetThreadLikesSchema =
	BaseThreadSchema.SetThreadLikesSchema.openapi("SetThreadLikesSchema");
export const OpenAPISetThreadLikesResponseSchema =
	BaseThreadSchema.SetThreadLikesResponseSchema.openapi(
		"SetThreadLikesResponseSchema",
	);
