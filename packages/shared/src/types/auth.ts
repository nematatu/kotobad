import { BaseAuthSchema } from "../schemas";
import { z } from "zod";

export type LoginSignupUserType = z.infer<
	typeof BaseAuthSchema.LoginSignupSchema
>;

export type UserJWTType = z.infer<typeof BaseAuthSchema.UserJWTSchema>;
