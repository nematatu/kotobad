"use client";

import { PERPAGE } from "@b3s/shared/src/config/thread";

type Props = {
	currentPage: number;
	totalCount: number;
};

export function ThreadDisplayCount({ currentPage, totalCount }: Props) {
	const startIndex = (currentPage - 1) * PERPAGE + 1;
	const endIndex = Math.min(currentPage * PERPAGE, totalCount);

	return (
		<div className="dark:text-gray-300 whitespace-normal sm:whitespace-nowrap">
			{totalCount} 件中 {startIndex} ~ {endIndex} を表示中
		</div>
	);
}
