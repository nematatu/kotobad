export const sortOptions = ["new", "old"] as const;
type Sort = (typeof sortOptions)[number];

export const sortLabel: Record<Sort, string> = {
	new: "新しい順",
	old: "古い順",
};

const sortSet: ReadonlySet<string> = new Set(sortOptions);
const isSortOption = (value: string): value is Sort => sortSet.has(value);

export const parseSort = (value: string | null | undefined): Sort => {
	if (value && isSortOption(value)) return value;
	return "new";
};
