"use client";

import Link from "next/link";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
	currentPage: number;
	totalPages: number;
};

export function ThreadPagination({ currentPage, totalPages }: Props) {
	return (
		<Pagination>
			<PaginationContent>
				{/* 前へ */}
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={`?page=${currentPage - 1}`} />
					</PaginationItem>
				)}

				{/* ページ番号 */}
				{[...Array(totalPages)].map((_, i) => {
					const page = i + 1;
					return (
						<PaginationItem key={page}>
							<PaginationLink asChild isActive={page === currentPage}>
								<Link href={`?page=${page}`}>{page}</Link>
							</PaginationLink>
						</PaginationItem>
					);
				})}

				{/* 次へ */}
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={`?page=${currentPage + 1}`} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
