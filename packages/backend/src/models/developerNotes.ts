import { BaseDeveloperNoteSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIDeveloperNoteSchema =
	BaseDeveloperNoteSchema.DeveloperNoteSchema.openapi("DeveloperNoteSchema");

export const OpenAPICreateDeveloperNoteSchema =
	BaseDeveloperNoteSchema.CreateDeveloperNoteSchema.openapi(
		"CreateDeveloperNoteSchema",
	);

export const OpenAPIDeveloperNoteListSchema =
	BaseDeveloperNoteSchema.DeveloperNoteListSchema.openapi(
		"DeveloperNoteListSchema",
	);
