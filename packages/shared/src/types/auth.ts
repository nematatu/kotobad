import type { z } from "zod";
import type { BaseAuthSchema } from "../schemas";

export type LoginSignupUserType = z.infer<
	typeof BaseAuthSchema.LoginSignupSchema
>;

export type UserJWTType = z.infer<typeof BaseAuthSchema.UserJWTSchema>;
