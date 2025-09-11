"use client";

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
	perPage?: number; // 1ページあたりの件数
};

export function ThreadPagination({
	currentPage,
	totalCount,
	perPage = 20,
}: Props) {
	const totalPages = Math.ceil(totalCount / perPage);

	return (
		<Pagination className="flex justify-end">
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
