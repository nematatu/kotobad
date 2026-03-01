import { BaseUserSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIUserProfileSchema =
	BaseUserSchema.UserProfileSchema.openapi("UserProfileSchema");

export const OpenAPIUploadAvatarResponseSchema =
	BaseUserSchema.UploadAvatarResponseSchema.openapi(
		"UploadAvatarResponseSchema",
	);
