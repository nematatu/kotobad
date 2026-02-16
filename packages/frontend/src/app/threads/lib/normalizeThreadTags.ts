import type { TagType } from "@kotobad/shared/src/types/tag";

const toNormalizedTag = (value: unknown): TagType | null => {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const record = value as Record<string, unknown>;
	const id = record.id;
	const name = record.name;
	if (typeof id !== "number" || typeof name !== "string") {
		return null;
	}

	const iconType = record.iconType;
	const iconValue = record.iconValue;
	return {
		id,
		name,
		iconType:
			iconType === "emoji" ||
			iconType === "image" ||
			iconType === "text" ||
			iconType === "none"
				? iconType
				: "none",
		iconValue: typeof iconValue === "string" ? iconValue : "",
	};
};

const normalizeThreadTags = (
	thread: Record<string, unknown>,
): Record<string, unknown> => {
	if (Array.isArray(thread.threadTags)) {
		const threadTags = thread.threadTags
			.map((entry) => {
				if (typeof entry === "object" && entry !== null && "tags" in entry) {
					const relation = entry as { tags?: unknown };
					return toNormalizedTag(relation.tags);
				}
				return toNormalizedTag(entry);
			})
			.filter((tag): tag is TagType => tag !== null);
		return { ...thread, threadTags };
	}
	if (Array.isArray(thread.threadLabels)) {
		const threadTags = thread.threadLabels
			.filter(
				(
					label,
				): label is {
					threadId: number;
					labelId: number;
					labels: Record<string, unknown>;
				} =>
					typeof label === "object" &&
					label !== null &&
					"labels" in label &&
					"labelId" in label,
			)
			.map((label) => toNormalizedTag(label.labels))
			.filter((tag): tag is TagType => tag !== null);
		return { ...thread, threadTags };
	}
	return { ...thread, threadTags: [] };
};

export default normalizeThreadTags;
