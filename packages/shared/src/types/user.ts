import type { z } from "zod";
import type {
	FavoritePlayerSchema,
	UpdateUserProfileResponseSchema,
	UpdateUserProfileSchema,
	UploadAvatarResponseSchema,
	UserProfileSchema,
	UserProfileSelectablePlayerSchema,
	UserProfileSelectablePlayersSchema,
	UserRecentPostSchema,
	UserRecentThreadSchema,
} from "../schemas/user";

export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type FavoritePlayerType = z.infer<typeof FavoritePlayerSchema>;
export type UserRecentThreadType = z.infer<typeof UserRecentThreadSchema>;
export type UserRecentPostType = z.infer<typeof UserRecentPostSchema>;
export type UpdateUserProfileType = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateUserProfileResponseType = z.infer<
	typeof UpdateUserProfileResponseSchema
>;
export type UserProfileSelectablePlayerType = z.infer<
	typeof UserProfileSelectablePlayerSchema
>;
export type UserProfileSelectablePlayersType = z.infer<
	typeof UserProfileSelectablePlayersSchema
>;
export type UploadAvatarResponseType = z.infer<
	typeof UploadAvatarResponseSchema
>;
