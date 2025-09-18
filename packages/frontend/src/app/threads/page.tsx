import { getAllThreads } from "@/lib/api/threads";
import { ThreadListSchema } from "@b3s/shared/src/schemas/thread";
import { LabelListSchema } from "@b3s/shared/src/schemas/label";
import { ThreadType, LabelType } from "@b3s/shared/src/types";
import ThreadPageClient from "./components/threads/ThreadPageClient";
import { getAllLabels } from "@/lib/api/labels";

type Props = {
	searchParams?: { page?: string };
};

export default async function Page({ searchParams }: Props) {
	const currentPage = Number(searchParams?.page ?? "1");

	const labelRes = await getAllLabels();
	const threadRes = await getAllThreads(currentPage);

	console.log("res", threadRes);

	if ("error" in threadRes || "error" in labelRes) {
		return <div>Server Error</div>;
	}

	const labels: LabelType.LabelListType = LabelListSchema.parse(labelRes);

	const threadsResponse: ThreadType.ThreadListType =
		ThreadListSchema.parse(threadRes);
	const threads: ThreadType.ThreadType[] = threadsResponse.threads;

	const totalCount: number = threadsResponse.totalCount;

	return (
		<div className="px-2 sm:px-5">
			<ThreadPageClient
				labels={labels}
				initialThreads={threads}
				currentPage={currentPage}
				totalCount={totalCount}
			/>
		</div>
	);
}
