import { BaseDeveloperRoadmapSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIDeveloperRoadmapItemSchema =
	BaseDeveloperRoadmapSchema.DeveloperRoadmapItemSchema.openapi(
		"DeveloperRoadmapItemSchema",
	);

export const OpenAPICreateDeveloperRoadmapItemSchema =
	BaseDeveloperRoadmapSchema.CreateDeveloperRoadmapItemSchema.openapi(
		"CreateDeveloperRoadmapItemSchema",
	);

export const OpenAPIUpdateDeveloperRoadmapStatusSchema =
	BaseDeveloperRoadmapSchema.UpdateDeveloperRoadmapStatusSchema.openapi(
		"UpdateDeveloperRoadmapStatusSchema",
	);

export const OpenAPIDeveloperRoadmapListSchema =
	BaseDeveloperRoadmapSchema.DeveloperRoadmapListSchema.openapi(
		"DeveloperRoadmapListSchema",
	);
