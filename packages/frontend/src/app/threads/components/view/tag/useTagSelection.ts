import { useState } from "react";

type TagOption = {
	id: number;
	name: string;
};

type Options = {
	initialTags?: TagOption[];
};

export const useTagSelection = ({ initialTags }: Options) => {
	const tags: TagOption[] = initialTags ?? [];
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
