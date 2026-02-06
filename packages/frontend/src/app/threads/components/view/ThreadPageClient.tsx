"use client";

import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ThreadDisplayCount } from "./ThreadDisplayCount";
import { ThreadList } from "./ThreadList";
import { ThreadPagination } from "./ThreadPageNation";

type Props = {
	initialThreads: ThreadType[];
	initialTags?: TagListType;
	initialQuery?: string;
	initialSearchCount?: number;
	currentPage: number;
	totalCount: number;
};

type SearchState = {
	inputValue: string;
	activeQuery: string;
	threads: ThreadType[];
	count: number;
	loading: boolean;
	error: string | null;
};

const MIN_QUERY_CHARS = 2;
const SEARCH_LIMIT = 20;
const DEBOUNCE_MS = 350;

const initialState: SearchState = {
	inputValue: "",
	activeQuery: "",
	threads: [],
	count: 0,
	loading: false,
	error: null,
};

export default function ThreadPageClient({
	initialThreads,
	initialQuery,
	initialSearchCount,
	currentPage,
	totalCount,
}: Props) {
	const normalizedInitialQuery = (initialQuery ?? "").trim();
	const initialIsSearch = normalizedInitialQuery.length >= MIN_QUERY_CHARS;
	const [state, setState] = useState<SearchState>(() => ({
		...initialState,
		inputValue: initialIsSearch ? normalizedInitialQuery : "",
		activeQuery: initialIsSearch ? normalizedInitialQuery : "",
		threads: initialIsSearch ? initialThreads : [],
		count: initialIsSearch ? (initialSearchCount ?? initialThreads.length) : 0,
	}));
	const set = useCallback((patch: Partial<SearchState>) => {
		setState((prev) => ({ ...prev, ...patch }));
	}, []);
	const [showMinCharsHint, setShowMinCharsHint] = useState(false);
	const searchParams = useSearchParams();

	const trimmedInput = state.inputValue.trim();
	const isFiltering = state.activeQuery.length >= MIN_QUERY_CHARS;
	const showThresholdHint = showMinCharsHint;

	const runSearch = useCallback(
		async (query: string) => {
			set({ loading: true, error: null, threads: [], count: 0 });
			const params = new URLSearchParams({
				q: query,
				page: "1",
				limit: String(SEARCH_LIMIT),
			});

			try {
				const res = await fetch(
					`/threads/api/threads/search?${params.toString()}`,
					{ method: "GET", cache: "no-store" },
				);
				if (!res.ok) throw new Error(`Search failed: ${res.status}`);

				const resThreadList = await res.json();
				const parsed = ThreadListSchema.parse(resThreadList);
				const { threads = [], totalCount: count = 0 } = parsed;

				set({ threads, count });
			} catch {
				set({ error: "検索に失敗しました", threads: [], count: 0 });
			} finally {
				set({ loading: false });
			}
		},
		[set],
	);

	useEffect(() => {
		const queryParam = (searchParams.get("q") ?? "").trim();
		setShowMinCharsHint(
			queryParam.length > 0 && queryParam.length < MIN_QUERY_CHARS,
		);
		if (queryParam === state.inputValue) return;
		set({ inputValue: queryParam });
	}, [searchParams, set, state.inputValue]);

	useEffect(() => {
		if (trimmedInput.length < MIN_QUERY_CHARS) {
			if (state.activeQuery) {
				set({
					activeQuery: "",
					threads: [],
					count: 0,
					error: null,
					loading: false,
				});
			}
			return;
		}

		if (trimmedInput === state.activeQuery) return;

		const handle = setTimeout(() => {
			set({ activeQuery: trimmedInput });
			runSearch(trimmedInput);
		}, DEBOUNCE_MS);

		return () => clearTimeout(handle);
	}, [trimmedInput, state.activeQuery, runSearch, set]);

	const threadsToShow = isFiltering
		? state.threads
		: [...initialThreads].slice(0, PERPAGE);

	const showEmptyAll = !isFiltering && totalCount === 0;
	const showEmptySearch =
		isFiltering && !state.loading && !state.error && state.count === 0;

	const statusText = showThresholdHint
		? `${MIN_QUERY_CHARS}文字以上で検索してください`
		: state.error
			? state.error
			: `${
					state.count > SEARCH_LIMIT
						? `（上位${threadsToShow.length}件を表示）`
						: ""
				}`;
	const statusClass = state.error
		? "text-xs text-red-500"
		: "text-xs text-slate-500";

	return (
		<div className="w-full max-w-5xl mx-auto flex flex-col space-y-3">
			<div className="w-full px-3 md:px-0 pt-5">
				<div className="text-xl font-bold">
					{isFiltering ? `「${state.activeQuery}」の検索結果` : "スレッド一覧"}
				</div>
			</div>
			<div className="w-full px-3 md:px-0">
				<div className="min-h-4">
					{statusText ? <p className={statusClass}>{statusText}</p> : null}
				</div>
			</div>
			<div>
				{showEmptyAll ? (
					<div className="flex justify-center text-2xl">
						スレッドがありません...
					</div>
				) : showEmptySearch ? (
					<div className="flex justify-center text-2xl">
						該当するスレッドがありません...
					</div>
				) : (
					<ThreadList threads={threadsToShow} />
				)}
				{!isFiltering && (
					<div className="flex flex-col items-center my-3 space-y-3">
						<ThreadPagination
							currentPage={currentPage}
							totalCount={totalCount}
						/>
						<ThreadDisplayCount
							currentPage={currentPage}
							totalCount={totalCount}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
