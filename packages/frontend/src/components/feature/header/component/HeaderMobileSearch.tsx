"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { HEADER_SEARCH_CONFIG } from "../const/serach-config";
import HistoryPanel from "./headerSearch/HistoryPanel";
import SuggestPanel from "./headerSearch/SuggestPanel";
import { useThreadSuggest } from "./headerSearch/useThreadSuggest";

const HeaderMobileSearch = () => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const history = useSearchHistory(5);

	const trimmedValue = query.trim();
	const suggestState = useThreadSuggest({ query: trimmedValue });
	const shouldShowSuggest =
		trimmedValue.length >= HEADER_SEARCH_CONFIG.MIN_QUERY_CHARS;
	const shouldShowHistory = trimmedValue.length === 0;

	return (
		<div className="[@media(min-width:496px)]:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="検索を開く"
						className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
					>
						<Search className="h-5 w-5" />
					</button>
				</SheetTrigger>
				<SheetContent side="top" className="px-4 pt-6 pb-8">
					<SheetHeader className="mb-4 text-left">
						<SheetTitle className="text-base">検索</SheetTitle>
						<SheetDescription className="sr-only">
							スレッド検索フォーム
						</SheetDescription>
					</SheetHeader>
					<form
						action="/threads"
						method="get"
						onSubmit={() => {
							history.add(query);
							setOpen(false);
						}}
						aria-label="スレッド検索"
						className="flex flex-col gap-3"
					>
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
							<Input
								type="search"
								name="q"
								autoComplete="off"
								autoFocus={open}
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
						</div>
						{shouldShowHistory ? (
							<HistoryPanel
								className="static mt-1"
								items={history.items}
								onSelect={(value) => {
									history.add(value);
									setOpen(false);
								}}
								onRemove={history.remove}
								onClear={history.clear}
							/>
						) : (
							<SuggestPanel
								open={shouldShowSuggest}
								query={trimmedValue}
								state={suggestState}
								onSelect={() => {
									history.add(trimmedValue);
									setOpen(false);
								}}
								className="static mt-1"
							/>
						)}
					</form>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default HeaderMobileSearch;
