import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type {
	ThreadListType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import ThreadPageClient from "./components/view/ThreadPageClient";

export type Props = {
	searchParams?: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const currentPage = Number(params?.page ?? "1");

	const targetUrl = getBffApiUrl("GET_ALL_THREADS") + `?page=${currentPage}`;

	const fetchthreadRes = await fetch(targetUrl);
	const threadRes = await fetchthreadRes.json();

	console.log("res", threadRes);

	const threadsResponse: ThreadListType = ThreadListSchema.parse(threadRes);
	const threads: ThreadType[] = threadsResponse.threads;

	const totalCount: number = threadsResponse.totalCount;

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
