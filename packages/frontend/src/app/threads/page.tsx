import ThreadPageClient from "./components/view/ThreadPageClient";
import { getThreads } from "./lib/getThread";
import { searchThreads } from "./lib/searchThreads";
export const dynamic = "force-dynamic";

export type Props = {
	searchParams?: Promise<{ page?: string; q?: string }>;
};

const MIN_QUERY_CHARS = 2;
const SEARCH_LIMIT = 20;

export default async function Page({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const query = (params?.q ?? "").trim();
	const isSearch = query.length >= MIN_QUERY_CHARS;
	const currentPage = isSearch ? 1 : Number(params?.page ?? "1");

	const { threads, totalCount } = isSearch
		? await searchThreads({
				query,
				page: 1,
				limit: SEARCH_LIMIT,
			})
		: await getThreads(currentPage);

	return (
		<div className="px-2 sm:px-5">
			<ThreadPageClient
				initialThreads={threads}
				initialQuery={isSearch ? query : ""}
				initialSearchCount={isSearch ? totalCount : 0}
				currentPage={currentPage}
				totalCount={totalCount}
			/>
		</div>
	);
}
