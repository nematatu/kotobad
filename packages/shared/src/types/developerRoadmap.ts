import type { z } from "zod";
import type {
	CreateDeveloperRoadmapItemSchema,
	DeveloperRoadmapItemSchema,
	DeveloperRoadmapListSchema,
	DeveloperRoadmapStatusSchema,
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

export type DeveloperRoadmapListType = z.infer<
	typeof DeveloperRoadmapListSchema
>;
