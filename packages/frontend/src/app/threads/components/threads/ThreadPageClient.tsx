"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreadList } from "./ThreadList";
import { CreateThread } from "./CreateThread";
import { ThreadPagination } from "./ThreadPageNation";
import { ThreadDisplayCount } from "./ThreadDisplayCount";
import { PERPAGE } from "@b3s/shared/src/config/thread";
import { ThreadType } from "@b3s/shared/src/types";
import { LabelListType } from "@b3s/shared/src/types/label";

type Props = {
	labels: LabelListType;
	initialThreads: ThreadType.ThreadType[];
	currentPage: number;
	totalCount: number;
};

export default function ThreadPageClient({
	labels,
	initialThreads,
	currentPage,
	totalCount,
}: Props) {
	const [threads, setThreads] = useState<ThreadType.ThreadType[]>([]);
	const router = useRouter();

	const handleCreated = (newThread: ThreadType.ThreadType) => {
		if (currentPage === 1) {
			setThreads((prev) => [newThread, ...prev]);
		} else {
			router.push("/threads?page=1");
		}
	};

	const currentThreads = [...threads, ...initialThreads].slice(0, PERPAGE);
	return (
		<div className="px-5">
			<div className="text-2xl sm:text-3xl font-bold pb-6">スレッド一覧</div>
			<CreateThread labels={labels} onCreated={handleCreated} />
			<div className="flex items-center my-2">
				<ThreadDisplayCount currentPage={currentPage} totalCount={totalCount} />
				<ThreadPagination
					currentPage={currentPage}
					totalCount={totalCount}
					position="end"
				/>
			</div>
			<ThreadList threads={currentThreads} />
			<div className="flex justify-end">
				<ThreadPagination currentPage={currentPage} totalCount={totalCount} />
			</div>
		</div>
	);
}
