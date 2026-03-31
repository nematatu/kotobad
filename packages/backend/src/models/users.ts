import { BaseUserSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIUserProfileSchema =
	BaseUserSchema.UserProfileSchema.openapi("UserProfileSchema");

export const OpenAPIUpdateUserProfileSchema =
	BaseUserSchema.UpdateUserProfileSchema.openapi("UpdateUserProfileSchema");
export const OpenAPIUpdateUserProfileResponseSchema =
	BaseUserSchema.UpdateUserProfileResponseSchema.openapi(
		"UpdateUserProfileResponseSchema",
	);
export const OpenAPIUserProfileSelectablePlayerSchema =
	BaseUserSchema.UserProfileSelectablePlayerSchema.openapi(
		"UserProfileSelectablePlayerSchema",
	);
export const OpenAPIUserProfileSelectablePlayersSchema =
	BaseUserSchema.UserProfileSelectablePlayersSchema.openapi(
		"UserProfileSelectablePlayersSchema",
	);

export const OpenAPIUploadAvatarResponseSchema =
	BaseUserSchema.UploadAvatarResponseSchema.openapi(
		"UploadAvatarResponseSchema",
	);
