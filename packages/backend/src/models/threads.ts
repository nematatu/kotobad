import { BaseThreadSchema } from "@b3s/shared/src/schemas";

export const OpenAPIThreadSchema = BaseThreadSchema.ThreadSchema.openapi(
	"ThreadSchema",
	{
		description: "スレッドスキーマ",
		example: {
			id: 1,
			title: "Honoはいいぞ",
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z",
			postCount: 1,
			authorId: 1,
			isPinned: false,
			isClosed: false,
			author: {
				username: "user",
			},
		},
	},
);

export const OpenAPICreateThreadSchema =
	BaseThreadSchema.CreateThreadSchema.openapi("CreateThreadSchema");
export const OpenAPIEditThreadSchema =
	BaseThreadSchema.EditThreadSchema.openapi("EditThreadSchema");
export const OpenAPIThreadListSchema =
	BaseThreadSchema.ThreadListSchema.openapi("ThreadListSchema");
