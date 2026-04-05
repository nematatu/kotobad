import { z } from "@hono/zod-openapi";

export const ErrorResponse = z.object({
	error: z.string(),
	message: z.string(),
	success: z.boolean().optional(),
});

export const SimpleErrorResponse = ErrorResponse.pick({
	error: true,
});
