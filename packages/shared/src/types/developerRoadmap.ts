import type { z } from "zod";
import type {
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

export type DeveloperRoadmapListType = z.infer<
	typeof DeveloperRoadmapListSchema
>;
