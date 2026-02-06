"use client";

import { cn } from "@/lib/utils";
import SuggestList from "./SuggestList";
import type { SuggestState } from "./useThreadSuggest";

type Props = {
	open: boolean;
	query: string;
	state: SuggestState;
	className?: string;
};

const SuggestPanel = ({ open, query, state, className }: Props) => {
	if (!open) return null;

	const showCount = state.totalCount !== null && query.length > 0;

	return (
		<div
			className={cn(
				"absolute left-0 right-0 top-full mt-2 rounded-sm border border-slate-200 bg-white text-slate-900 shadow-lg animate-fade-in-up z-[70]",
				className,
			)}
		>
			{showCount ? (
				<div className="px-3 pt-3 text-xs text-slate-500">
					{query}の{state.totalCount}件の検索結果
				</div>
			) : null}
			{state.loading ? (
				<div className="px-3 py-2 text-xs text-slate-500">検索中...</div>
			) : state.items.length === 0 ? (
				<div className="px-3 py-2 text-xs text-slate-500">
					該当するスレッドがありません
				</div>
			) : (
				<SuggestList items={state.items} query={query} />
			)}
		</div>
	);
};

export default SuggestPanel;
