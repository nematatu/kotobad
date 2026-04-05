import type { z } from "zod";
import type {
	CreateDeveloperRoadmapItemSchema,
	DeveloperRoadmapItemSchema,
	DeveloperRoadmapListSchema,
	DeveloperRoadmapStatusSchema,
	UpdateDeveloperRoadmapItemSchema,
} from "../schemas/developerRoadmap";

export type DeveloperRoadmapStatusType = z.infer<
	typeof DeveloperRoadmapStatusSchema
>;

export type DeveloperRoadmapItemType = z.infer<
	typeof DeveloperRoadmapItemSchema
>;

export type CreateDeveloperRoadmapItemType = z.infer<
	typeof CreateDeveloperRoadmapItemSchema
>;

export type UpdateDeveloperRoadmapItemType = z.infer<
	typeof UpdateDeveloperRoadmapItemSchema
>;

export type DeveloperRoadmapListType = z.infer<
	typeof DeveloperRoadmapListSchema
>;
