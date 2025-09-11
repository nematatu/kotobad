"use client";

type Props = {
	currentPage: number;
	totalCount: number;
	perPage?: number;
};

export function ThreadDisplayCount({
	currentPage,
	totalCount,
	perPage = 20,
}: Props) {
	const startIndex = (currentPage - 1) * 20 + 1;
	const endIndex = Math.min(currentPage * perPage, totalCount);

	return (
		<div className="dark:text-gray-300 whitespace-normal sm:whitespace-nowrap">
			{totalCount} 件中 {startIndex} ~ {endIndex} を表示中
		</div>
	);
}
