import { z } from "zod";

const dateLike = z.union([z.string(), z.number(), z.date()]);

export const BetterAuthSessionSchema = z
	.object({
		id: z.string(),
		token: z.string(),
		expiresAt: dateLike,
		createdAt: dateLike.optional(),
		updatedAt: dateLike.optional(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		userId: z.string().optional().nullable(),
	})
	.passthrough();

export const BetterAuthUserSchema = z
	.object({
		id: z.string(),
		email: z.string().email(),
		name: z.string().optional().nullable(),
		image: z.string().optional().nullable(),
		emailVerified: z.union([z.boolean(), z.null()]).optional(),
		createdAt: dateLike.optional(),
		updatedAt: dateLike.optional(),
	})
	.passthrough();

export const BetterAuthSessionResponseSchema = z.object({
	session: BetterAuthSessionSchema,
	user: BetterAuthUserSchema,
});

export type BetterAuthSessionResponse = z.infer<
	typeof BetterAuthSessionResponseSchema
>;
export type BetterAuthUser = z.infer<typeof BetterAuthUserSchema>;
