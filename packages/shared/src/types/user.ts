import type { z } from "zod";
import type {
	UploadAvatarResponseSchema,
	UserProfileSchema,
	UserRecentPostSchema,
	UserRecentThreadSchema,
} from "../schemas/user";

export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type UserRecentThreadType = z.infer<typeof UserRecentThreadSchema>;
export type UserRecentPostType = z.infer<typeof UserRecentPostSchema>;
export type UploadAvatarResponseType = z.infer<
	typeof UploadAvatarResponseSchema
>;
