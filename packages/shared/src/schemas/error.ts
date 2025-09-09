import { z } from "zod";

export const ErrorResponse = z.object({
	error: z.string(),
	message: z.string(),
	success: z.boolean().optional(),
});

export const SimpleErrorResponse = ErrorResponse.pick({
	error: true,
});

export const ValidationErrorResponse = z.object({
	message: z.string(),
	stack: z.string(),
	success: z.boolean(),
});
