import { z } from "@hono/zod-openapi";

export const DeveloperNoteStatusSchema = z.enum(["wip", "todo", "done"]);
export const DeveloperNoteKindSchema = z.enum(["log", "note"]);

export const DeveloperNoteAuthorSchema = z.object({
	name: z.string(),
	image: z.string().nullable().optional(),
});

export const DeveloperNoteSchema = z.object({
	id: z.number().int().positive(),
	content: z.string().min(1),
	status: DeveloperNoteStatusSchema,
	kind: DeveloperNoteKindSchema,
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	authorId: z.string(),
	author: DeveloperNoteAuthorSchema,
});

export const CreateDeveloperNoteSchema = z.object({
	content: z.string().trim().min(1).max(4000),
	status: DeveloperNoteStatusSchema,
	kind: DeveloperNoteKindSchema,
});

export const DeveloperNoteListSchema = z.object({
	notes: z.array(DeveloperNoteSchema),
	canCreate: z.boolean(),
});
