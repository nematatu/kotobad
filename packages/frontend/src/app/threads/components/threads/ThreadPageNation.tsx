"use client";
import { PERPAGE } from "@kotobad/shared/src/config/thread";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
	currentPage: number;
	totalCount: number;
	position?: "start" | "center" | "end";
};

export function ThreadPagination({
	currentPage,
	totalCount,
	position = "center",
}: Props) {
	const totalPages = Math.ceil(totalCount / PERPAGE);

	if (totalCount === 0) return;

	return (
		<Pagination className={`flex justify-${position}`}>
			<PaginationContent>
				{/* 前へ */}
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious
							href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
							className={currentPage == 1 ? "hidden pointer-events-none" : ""}
						/>
					</PaginationItem>
				)}
				{/* ページ番号 */}
				{[...Array(totalPages)].map((_, i) => {
					const page = i + 1;
					return (
						<PaginationItem key={page}>
							<PaginationLink
								href={`?page=${page}`} // 直接 href を渡す
								isActive={page === currentPage}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				{/* 次へ */}
				<PaginationItem>
					<PaginationNext
						href={`?page=${currentPage + 1}`}
						className={currentPage === totalPages ? "invisible" : ""}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
