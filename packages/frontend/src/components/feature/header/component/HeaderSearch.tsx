"use client";

import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Link } from "@/components/common/Link";
import { viewTransitionKeys } from "@/config/viewTransition";

const HeaderSearch = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const href =
		pathname === "/search"
			? `/search${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
			: "/search";

	return (
		<div className="flex flex-1 min-w-0 items-center justify-end [@media(min-width:496px)]:justify-start">
			<Link
				href={href}
				viewTransitionKey={viewTransitionKeys.searchPageNavigation}
				aria-label="検索ページへ移動"
				className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
			>
				<Search className="size-5" />
			</Link>
		</div>
	);
};

export default HeaderSearch;
