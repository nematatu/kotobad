import { z } from "@hono/zod-openapi";

const DeveloperNoteAuthorSchema = z.object({
	name: z.string(),
	image: z.string().nullable().optional(),
});

export const DeveloperNoteLabelSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().trim().min(1),
	name: z.string().trim().min(1),
});

export const DeveloperNoteSchema = z.object({
	id: z.number().int().positive(),
	content: z.string().min(1),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
	authorId: z.string(),
	author: DeveloperNoteAuthorSchema,
	label: DeveloperNoteLabelSchema.nullable(),
});

export const CreateDeveloperNoteSchema = z.object({
	content: z.string().trim().min(1).max(4000),
});

export const UpdateDeveloperNoteLabelSchema = z.object({
	labelId: z.number().int().positive().nullable(),
});

export const DeveloperNoteListSchema = z.object({
	notes: z.array(DeveloperNoteSchema),
	labels: z.array(DeveloperNoteLabelSchema),
	canCreate: z.boolean(),
});
