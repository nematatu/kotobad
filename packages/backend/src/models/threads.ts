import { BaseThreadSchema } from "@b3s/shared/src/schemas";

export const OpenAPIThreadSchema =
	BaseThreadSchema.ThreadSchema.openapi("ThreadSchema");

export const OpenAPICreateThreadSchema =
	BaseThreadSchema.CreateThreadSchema.openapi("CreateThreadSchema");
export const OpenAPIEditThreadSchema =
	BaseThreadSchema.EditThreadSchema.openapi("EditThreadSchema");
export const OpenAPIThreadListSchema =
	BaseThreadSchema.ThreadListSchema.openapi("ThreadListSchema");
