import { z } from "@hono/zod-openapi";

export const DeveloperRoadmapStatusSchema = z.enum(["wip", "todo", "done"]);

export const DeveloperRoadmapItemSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	isArchived: z.boolean().default(false),
	status: DeveloperRoadmapStatusSchema,
	sortOrder: z.number().int().nonnegative(),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
});

export const CreateDeveloperRoadmapItemSchema = z.object({
	title: z.string().trim().min(1).max(400),
	status: DeveloperRoadmapStatusSchema,
});

export const UpdateDeveloperRoadmapItemSchema = z
	.object({
		title: z.string().trim().min(1).max(400).optional(),
		status: DeveloperRoadmapStatusSchema.optional(),
		isArchived: z.boolean().optional(),
	})
	.refine(
		(value) =>
			value.title !== undefined ||
			value.status !== undefined ||
			value.isArchived !== undefined,
		{
			message: "At least one field must be provided",
			path: [],
		},
	);

export const DeveloperRoadmapListSchema = z.array(DeveloperRoadmapItemSchema);
