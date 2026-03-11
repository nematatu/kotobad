import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";

type Props = {
	currentPage: number;
	totalCount: number;
};

type PageItem = number | "ellipsis";

function createPageItems(currentPage: number, totalPages: number): PageItem[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const pages = new Set<number>([1, totalPages]);

	if (currentPage <= 3) {
		pages.add(2);
		pages.add(3);
		pages.add(4);
	} else if (currentPage >= totalPages - 2) {
		pages.add(totalPages - 3);
		pages.add(totalPages - 2);
		pages.add(totalPages - 1);
	} else {
		pages.add(currentPage - 1);
		pages.add(currentPage);
		pages.add(currentPage + 1);
	}

	const sortedPages = [...pages]
		.filter((page) => page >= 1 && page <= totalPages)
		.sort((a, b) => a - b);
	const pageItems: PageItem[] = [];

	for (const page of sortedPages) {
		const prev = pageItems[pageItems.length - 1];
		if (typeof prev === "number" && page - prev > 1) {
			pageItems.push("ellipsis");
		}
		pageItems.push(page);
	}

	return pageItems;
}

function getPageHref(page: number): string {
	return page === 1 ? "/threads" : `/threads?page=${page}`;
}

export function ThreadPageNation({ currentPage, totalCount }: Props) {
	const totalPages = Math.ceil(totalCount / PERPAGE);

	if (totalPages <= 1) {
		return null;
	}

	const safeCurrentPage =
		Number.isFinite(currentPage) && currentPage > 0
			? Math.trunc(currentPage)
			: 1;
	const normalizedCurrentPage = Math.min(
		Math.max(safeCurrentPage, 1),
		totalPages,
	);
	const pageItems = createPageItems(normalizedCurrentPage, totalPages);
	const hasPrevious = normalizedCurrentPage > 1;
	const hasNext = normalizedCurrentPage < totalPages;
	const previousPage = normalizedCurrentPage - 1;
	const nextPage = normalizedCurrentPage + 1;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationLink
						href={hasPrevious ? getPageHref(previousPage) : "#"}
						aria-label="前のページへ"
						aria-disabled={!hasPrevious}
						tabIndex={hasPrevious ? 0 : -1}
						className="h-8 w-8 rounded-full hover:bg-muted aria-disabled:pointer-events-none aria-disabled:opacity-40"
					>
						<ChevronLeftIcon className="size-4" />
					</PaginationLink>
				</PaginationItem>

				{pageItems.map((item, index) => {
					if (item === "ellipsis") {
						const prevPage = pageItems[index - 1];
						const nextPage = pageItems[index + 1];
						const ellipsisKey = `ellipsis-${typeof prevPage === "number" ? prevPage : "start"}-${typeof nextPage === "number" ? nextPage : "end"}`;

						return (
							<PaginationItem key={ellipsisKey}>
								<PaginationEllipsis />
							</PaginationItem>
						);
					}

					return (
						<PaginationItem key={item}>
							<PaginationLink
								href={getPageHref(item)}
								isActive={item === normalizedCurrentPage}
								aria-label={`${item}ページへ`}
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<PaginationLink
						href={hasNext ? getPageHref(nextPage) : "#"}
						aria-label="次のページへ"
						aria-disabled={!hasNext}
						tabIndex={hasNext ? 0 : -1}
						className="h-8 w-8 rounded-full hover:bg-muted aria-disabled:pointer-events-none aria-disabled:opacity-40"
					>
						<ChevronRightIcon className="size-4" />
					</PaginationLink>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
