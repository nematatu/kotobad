import { PERPAGE } from "@kotobad/shared/src/config/thread";

type Props = {
	currentPage: number;
	totalCount: number;
};

export function ThreadDisplayCount({ currentPage, totalCount }: Props) {
	const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * PERPAGE + 1;
	const endIndex = Math.min(currentPage * PERPAGE, totalCount);

	return (
		<div className="text-sm shrink-0 dark:text-gray-300 whitespace-normal sm:whitespace-nowrap">
			{totalCount} 件中 {startIndex} ~ {endIndex} を表示中
		</div>
	);
}
