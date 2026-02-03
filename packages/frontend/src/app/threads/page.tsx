import ThreadPageClient from "./components/view/ThreadPageClient";
import { getThreads } from "./lib/getThread";
export const dynamic = "force-dynamic";

export type Props = {
	searchParams?: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const currentPage = Number(params?.page ?? "1");

	const { threads, totalCount } = await getThreads(currentPage);

	return (
		<div className="px-2 sm:px-5">
			<ThreadPageClient
				initialThreads={threads}
				currentPage={currentPage}
				totalCount={totalCount}
			/>
		</div>
	);
}
