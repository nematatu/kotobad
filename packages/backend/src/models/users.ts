import { z } from "@hono/zod-openapi";
import { BaseUserSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIUpdateUserProfileSchema = z
	.object({
		name: z.string().min(1).max(20).optional(),
		bio: z.string().max(240).nullable().optional(),
		favoritePlayerIds: z
			.array(z.coerce.number().int().positive())
			.max(3)
			.optional(),
		image: z.string().openapi({ type: "string", format: "binary" }).optional(),
		headerImage: z
			.string()
			.openapi({ type: "string", format: "binary" })
			.optional(),
	})
	.openapi("UpdateUserProfileSchema");

export const OpenAPIUserProfileSchema =
	BaseUserSchema.UserProfileSchema.openapi("UserProfileSchema");

export const OpenAPIUpdateUserProfileResponseSchema =
	BaseUserSchema.UpdateUserProfileResponseSchema.openapi(
		"UpdateUserProfileResponseSchema",
	);
export const OpenAPIUserProfileSelectablePlayersSchema =
	BaseUserSchema.UserProfileSelectablePlayersSchema.openapi(
		"UserProfileSelectablePlayersSchema",
	);
