import type { z } from "zod";
import type {
	FavoritePlayerSchema,
	UserProfileSchema,
	UserProfileSelectablePlayerSchema,
} from "../schemas/user";

export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type FavoritePlayerType = z.infer<typeof FavoritePlayerSchema>;
export type UserProfileSelectablePlayerType = z.infer<
	typeof UserProfileSelectablePlayerSchema
>;
