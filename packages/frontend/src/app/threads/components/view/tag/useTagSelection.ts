import type { TagType } from "@kotobad/shared/src/types/tag";
import { useState } from "react";

type Options = {
	initialTags?: TagType[];
};

export const useTagSelection = ({ initialTags }: Options) => {
	const tags: TagType[] = initialTags ?? [];
	const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

	const toggleTag = (id: number) => {
		setSelectedTagIds((prev) =>
			prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id],
		);
	};

	const resetTagSelection = () => {
		setSelectedTagIds([]);
	};

	return {
		tags,
		selectedTagIds,
		toggleTag,
		resetTagSelection,
	};
};
