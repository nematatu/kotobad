"use client";

import { Search } from "lucide-react";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import type { Sort } from "@/app/threads/lib/sort";
import HistoryPanel from "@/components/feature/header/component/headerSearch/HistoryPanel";
import { HEADER_SEARCH_CONFIG } from "@/components/feature/header/const/serach-config";
import { Input } from "@/components/ui/input";
import { viewTransitionKeys } from "@/config/viewTransition";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";

type Props = {
	initialQuery: string;
	sort: Sort;
};

const buildSearchHref = (query: string, sort: Sort) => {
	const trimmedQuery = query.trim();

	if (trimmedQuery.length === 0) {
		return "/search";
	}

	const params = new URLSearchParams({
		q: trimmedQuery,
	});

	if (sort !== "new") {
		params.set("sort", sort);
	}

	return `/search?${params.toString()}`;
};

export default function ThreadSearchForm({ initialQuery, sort }: Props) {
	const router = useViewTransitionRouter();
	const history = useSearchHistory(5);
	const [query, setQuery] = useState(initialQuery);
	const shouldShowHistory = query.trim().length === 0;

	useEffect(() => {
		setQuery(initialQuery);
	}, [initialQuery]);

	const navigateToSearch = useCallback(
		(nextQuery: string) => {
			router.replace(buildSearchHref(nextQuery, sort), {
				scroll: false,
				viewTransitionKey: viewTransitionKeys.searchPageQueryControls,
			});
		},
		[router, sort],
	);

	useEffect(() => {
		const trimmedQuery = query.trim();
		const trimmedInitialQuery = initialQuery.trim();

		if (trimmedQuery === trimmedInitialQuery) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			navigateToSearch(query);
		}, HEADER_SEARCH_CONFIG.DEBOUNCE_MS);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [initialQuery, navigateToSearch, query]);

	const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
		event.currentTarget.blur();
		const input = event.currentTarget.form?.querySelector("input[name='q']");
		if (input instanceof HTMLInputElement) {
			input.blur();
		}
		setQuery("");
		navigateToSearch("");
	};

	return (
		<form
			action="/search"
			method="get"
			onSubmit={(event) => {
				event.preventDefault();
				const input = event.currentTarget.querySelector("input[name='q']");
				if (input instanceof HTMLInputElement) {
					input.blur();
				}
				history.add(query);
				navigateToSearch(query);
			}}
			className="flex flex-col gap-3"
			aria-label="スレッド検索"
		>
			<div className="relative">
				<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
				<Input
					type="search"
					name="q"
					autoComplete="off"
					autoFocus
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="キーワードを入力..."
					className="w-full pl-9 pr-10 focus:border-slate-400 focus:ring-0 focus-visible:border-slate-400 focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
				/>
				<button
					type="button"
					aria-label="入力をクリア"
					onMouseDown={(event) => event.preventDefault()}
					onClick={handleClear}
					className="absolute right-3 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center text-base leading-none text-slate-400 hover:text-slate-600"
				>
					×
				</button>
			</div>
			{shouldShowHistory ? (
				<HistoryPanel
					className="static mt-1"
					items={history.items}
					hrefBuilder={(value) => buildSearchHref(value, sort)}
					viewTransitionKey={viewTransitionKeys.searchPageQueryControls}
					onSelect={(value) => {
						history.add(value);
					}}
					onRemove={history.remove}
					onClear={history.clear}
				/>
			) : null}
		</form>
	);
}
