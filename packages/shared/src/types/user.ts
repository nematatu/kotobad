import type { z } from "zod";
import type {
	UserProfileSchema,
	UserRecentPostSchema,
	UserRecentThreadSchema,
} from "../schemas/user";

export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type UserRecentThreadType = z.infer<typeof UserRecentThreadSchema>;
export type UserRecentPostType = z.infer<typeof UserRecentPostSchema>;
