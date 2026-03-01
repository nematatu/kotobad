import { BaseUserSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIUserProfileSchema =
	BaseUserSchema.UserProfileSchema.openapi("UserProfileSchema");
