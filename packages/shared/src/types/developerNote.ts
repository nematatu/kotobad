import type { z } from "zod";
import type {
	CreateDeveloperNoteSchema,
	DeveloperNoteKindSchema,
	DeveloperNoteListSchema,
	DeveloperNoteSchema,
	DeveloperNoteStatusSchema,
} from "../schemas/developerNote";

export type DeveloperNoteType = z.infer<typeof DeveloperNoteSchema>;

export type CreateDeveloperNoteType = z.infer<typeof CreateDeveloperNoteSchema>;

export type DeveloperNoteListType = z.infer<typeof DeveloperNoteListSchema>;

export type DeveloperNoteStatusType = z.infer<typeof DeveloperNoteStatusSchema>;

export type DeveloperNoteKindType = z.infer<typeof DeveloperNoteKindSchema>;
