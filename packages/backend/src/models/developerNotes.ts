import { BaseDeveloperNoteSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIDeveloperNoteLabelSchema =
	BaseDeveloperNoteSchema.DeveloperNoteLabelSchema.openapi(
		"DeveloperNoteLabelSchema",
	);

export const OpenAPIDeveloperNoteSchema =
	BaseDeveloperNoteSchema.DeveloperNoteSchema.openapi("DeveloperNoteSchema");

export const OpenAPICreateDeveloperNoteSchema =
	BaseDeveloperNoteSchema.CreateDeveloperNoteSchema.openapi(
		"CreateDeveloperNoteSchema",
	);

export const OpenAPIUpdateDeveloperNoteLabelSchema =
	BaseDeveloperNoteSchema.UpdateDeveloperNoteLabelSchema.openapi(
		"UpdateDeveloperNoteLabelSchema",
	);

export const OpenAPIDeveloperNoteListSchema =
	BaseDeveloperNoteSchema.DeveloperNoteListSchema.openapi(
		"DeveloperNoteListSchema",
	);
