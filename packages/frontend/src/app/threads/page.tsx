import { getAllThreads } from "@/lib/api/threads";
import { ThreadListSchema } from "@b3s/shared/src/schemas/thread";
import { ThreadType } from "@b3s/shared/src/types";
import ThreadPageClient from "./components/threads/ThreadPageClient";

type Props = {
	searchParams?: { page?: string };
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params?.page ?? "1");

	const threadRes = await getAllThreads(currentPage);

	console.log("res", threadRes);

	const threadsResponse: ThreadType.ThreadListType =
		ThreadListSchema.parse(threadRes);
	const threads: ThreadType.ThreadType[] = threadsResponse.threads;

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
