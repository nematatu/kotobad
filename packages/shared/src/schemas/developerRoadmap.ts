import { z } from "@hono/zod-openapi";

export const DeveloperRoadmapStatusSchema = z.enum(["wip", "todo", "done"]);

export const DeveloperRoadmapItemSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	status: DeveloperRoadmapStatusSchema,
	sortOrder: z.number().int().nonnegative(),
	createdAt: z.string(),
	updatedAt: z.string().nullable(),
});

export const CreateDeveloperRoadmapItemSchema = z.object({
	title: z.string().trim().min(1).max(400),
	status: DeveloperRoadmapStatusSchema,
});

export const DeveloperRoadmapListSchema = z.array(DeveloperRoadmapItemSchema);
