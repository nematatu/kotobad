import type { BaseAuthSchema } from "../schemas";
import type { z } from "zod";

export type LoginSignupUserType = z.infer<
	typeof BaseAuthSchema.LoginSignupSchema
>;

export type UserJWTType = z.infer<typeof BaseAuthSchema.UserJWTSchema>;
