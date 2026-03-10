import { z } from "@hono/zod-openapi";

export const DeveloperNoteAuthorSchema = z.object({
	name: z.string(),
	image: z.string().nullable().optional(),
});

export const DeveloperNoteSchema = z.object({
	id: z.number().int().positive(),
	content: z.string().min(1),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	authorId: z.string(),
	author: DeveloperNoteAuthorSchema,
});

export const CreateDeveloperNoteSchema = z.object({
	content: z.string().trim().min(1).max(4000),
});

export const DeveloperNoteListSchema = z.object({
	notes: z.array(DeveloperNoteSchema),
	canCreate: z.boolean(),
});
