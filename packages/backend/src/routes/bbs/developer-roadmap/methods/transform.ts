import type { DeveloperRoadmapItemType } from "@kotobad/shared/src/types/developerRoadmap";

export type DeveloperRoadmapQueryResult = {
	id: number;
	title: string;
	isArchived: boolean;
	status: DeveloperRoadmapItemType["status"];
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export const toDeveloperRoadmapResponse = (
	item: DeveloperRoadmapQueryResult,
): DeveloperRoadmapItemType => {
	return {
		id: item.id,
		title: item.title,
		isArchived: item.isArchived,
		status: item.status,
		sortOrder: item.sortOrder,
		createdAt: item.createdAt.toISOString(),
		updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
	};
};
