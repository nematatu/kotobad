import type { TagType } from "@kotobad/shared/src/types/tag";

type RelationLike = {
	tags?: unknown;
};

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

const toTagCandidate = (entry: unknown): unknown => {
	if (typeof entry === "object" && entry !== null && "tags" in entry) {
		return (entry as RelationLike).tags;
	}
	return entry;
};

const normalizeThreadTags = (
	thread: Record<string, unknown>,
): Record<string, unknown> => {
	if (!Array.isArray(thread.threadTags)) {
		return { ...thread, threadTags: [] };
	}

	const threadTags = thread.threadTags
		.map(toTagCandidate)
		.map(toNormalizedTag)
		.filter((tag): tag is TagType => tag !== null);

	return { ...thread, threadTags };
};

export default normalizeThreadTags;
