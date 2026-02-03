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

	const justifyClass =
		position === "start"
			? "justify-start"
			: position === "end"
				? "justify-end"
				: "justify-center";

	return (
		<Pagination className={justifyClass}>
			<PaginationContent>
				{/* 前へ */}
				<PaginationItem className={currentPage === 1 ? "invisible" : ""}>
					<PaginationPrevious
						href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
						className={currentPage === 1 ? "pointer-events-none" : ""}
					/>
				</PaginationItem>
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
				<PaginationItem
					className={currentPage === totalPages ? "invisible" : ""}
				>
					<PaginationNext
						href={`?page=${currentPage + 1}`}
						className={currentPage === totalPages ? "pointer-events-none" : ""}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
