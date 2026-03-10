import type { z } from "zod";
import type {
	CreateDeveloperNoteSchema,
	DeveloperNoteListSchema,
	DeveloperNoteSchema,
} from "../schemas/developerNote";

export type DeveloperNoteType = z.infer<typeof DeveloperNoteSchema>;

export type CreateDeveloperNoteType = z.infer<typeof CreateDeveloperNoteSchema>;

export type DeveloperNoteListType = z.infer<typeof DeveloperNoteListSchema>;
