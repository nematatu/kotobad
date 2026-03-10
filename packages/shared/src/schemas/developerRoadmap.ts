import { z } from "@hono/zod-openapi";

export const DeveloperRoadmapStatusSchema = z.enum(["wip", "todo", "done"]);

export const DeveloperRoadmapItemSchema = z.object({
	title: z.string().min(1),
	summary: z.string().min(1),
	status: DeveloperRoadmapStatusSchema,
});

export const DeveloperRoadmapListSchema = z.array(DeveloperRoadmapItemSchema);
