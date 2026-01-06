import ThreadPageClient from "./components/view/ThreadPageClient";
import { getTags } from "./lib/getTags";
import { getThreads } from "./lib/getThread";
export const revalidate = 900;
export const dynamic = "force-static";

export type Props = {
	searchParams?: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const currentPage = Number(params?.page ?? "1");

	const [{ threads, totalCount }, tags] = await Promise.all([
		getThreads(currentPage),
		getTags(),
	]);

	console.log("tags", tags);
	return (
		<div className="px-2 sm:px-5">
			<ThreadPageClient
				initialThreads={threads}
				initialTags={tags}
				currentPage={currentPage}
				totalCount={totalCount}
			/>
		</div>
	);
}
