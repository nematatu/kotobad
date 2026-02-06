"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { HEADER_SEARCH_CONFIG } from "../const/serach-config";
import HistoryPanel from "./headerSearch/HistoryPanel";
import SuggestPanel from "./headerSearch/SuggestPanel";
import { useThreadSuggest } from "./headerSearch/useThreadSuggest";

type Props = {
	value?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
};

const HeaderSearch = (_props: Props) => {
	const searchParams = useSearchParams();
	const queryParam = (searchParams.get("q") ?? "").trim();
	const [query, setQuery] = useState("");
	const trimmedValue = query.trim();
	const suggestState = useThreadSuggest({ query: trimmedValue });
	const history = useSearchHistory(5);

	const shouldShowSuggest =
		trimmedValue.length >= HEADER_SEARCH_CONFIG.MIN_QUERY_CHARS;
	const shouldShowHistory =
		trimmedValue.length === 0 && history.items.length > 0;

	useEffect(() => {
		setQuery(queryParam);
	}, [queryParam]);

	return (
		<form
			action="/threads"
			method="get"
			onSubmit={(event) => {
				history.add(query);
				const input = event.currentTarget.querySelector("input");
				if (input instanceof HTMLInputElement) input.blur();
			}}
			className="flex-1 min-w-0 flex items-center gap-2"
			aria-label="スレッド検索"
		>
			<div className="group relative w-full min-w-0 flex-1">
				<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors" />
				<Input
					type="search"
					name="q"
					autoComplete="off"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="スレッドを検索..."
					className="pl-9 pr-10 w-full focus:border-slate-400 focus:ring-0 focus-visible:border-slate-400 focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
				/>
				<button
					type="button"
					aria-label="入力をクリア"
					onClick={() => setQuery("")}
					className="absolute right-3 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center text-base leading-none text-slate-400 hover:text-slate-600"
				>
					×
				</button>
				{shouldShowHistory ? (
					<HistoryPanel
						className="hidden group-focus-within:block"
						items={history.items}
						onSelect={(query) => {
							history.add(query);
						}}
						onRemove={history.remove}
						onClear={history.clear}
					/>
				) : (
					<SuggestPanel
						open={shouldShowSuggest}
						query={trimmedValue}
						state={suggestState}
						className="hidden group-focus-within:block"
					/>
				)}
			</div>
		</form>
	);
};

export default HeaderSearch;
