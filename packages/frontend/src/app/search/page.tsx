import NoThread from "@/app/threads/components/view/NoThread";
import { ThreadList } from "@/app/threads/components/view/ThreadList";
import { SortSelect } from "@/app/threads/components/view/ui/sort/sortSelect";
import { searchThreads } from "@/app/threads/lib/searchThreads";
import { parseSort } from "@/app/threads/lib/sort";
import RouterBackButton from "@/components/common/RouterBackButton";
import { HEADER_SEARCH_CONFIG } from "@/components/feature/header/const/serach-config";
import ThreadSearchForm from "@/components/feature/search/ThreadSearchForm";

export const dynamic = "force-dynamic";

type Props = {
	searchParams?: Promise<{ q?: string; sort?: string }>;
};

const SEARCH_LIMIT = 20;

export default async function SearchPage({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const query = (params?.q ?? "").trim();
	const sort = parseSort(params?.sort);
	const isSearch = query.length >= HEADER_SEARCH_CONFIG.MIN_QUERY_CHARS;
	const isTooShort =
		query.length > 0 && query.length < HEADER_SEARCH_CONFIG.MIN_QUERY_CHARS;

	const { threads } = isSearch
		? await searchThreads({
				query,
				page: 1,
				limit: SEARCH_LIMIT,
				sort,
			})
		: { threads: [] };

	return (
		<div className="mx-auto w-full max-w-5xl px-3 py-5 md:px-5">
			<div className="flex flex-col space-y-5">
				<div className="space-y-2">
					<RouterBackButton
						label="戻る"
						fallbackHref="/threads"
						className="self-start"
					/>
					<div className="space-y-1">
						<h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
							検索
						</h1>
						<p className="text-xs text-slate-500 dark:text-slate-400">
							{HEADER_SEARCH_CONFIG.MIN_QUERY_CHARS}
							文字以上でスレッドを検索できます
						</p>
					</div>
				</div>

				<ThreadSearchForm initialQuery={query} sort={sort} />

				{isTooShort ? (
					<p className="text-xs text-slate-500 dark:text-slate-400">
						{HEADER_SEARCH_CONFIG.MIN_QUERY_CHARS}文字以上で検索してください
					</p>
				) : null}

				{isSearch ? (
					threads.length === 0 ? (
						<NoThread query={query} />
					) : (
						<div className="space-y-3">
							<div className="flex items-center justify-end gap-3">
								<SortSelect />
							</div>
							<ThreadList threads={threads} highlightQuery={query} />
						</div>
					)
				) : null}
			</div>
		</div>
	);
}
