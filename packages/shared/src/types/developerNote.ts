import type { z } from "zod";
import type {
	CreateDeveloperNoteSchema,
	DeveloperNoteLabelSchema,
	DeveloperNoteListSchema,
	DeveloperNoteSchema,
	UpdateDeveloperNoteLabelSchema,
} from "../schemas/developerNote";

export type DeveloperNoteType = z.infer<typeof DeveloperNoteSchema>;

export type DeveloperNoteLabelType = z.infer<typeof DeveloperNoteLabelSchema>;

export type CreateDeveloperNoteType = z.infer<typeof CreateDeveloperNoteSchema>;

export type UpdateDeveloperNoteLabelType = z.infer<
	typeof UpdateDeveloperNoteLabelSchema
>;

export type DeveloperNoteListType = z.infer<typeof DeveloperNoteListSchema>;
