"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreadList } from "./ThreadList";
import { CreateThread } from "./CreateThread";
import { ThreadPagination } from "./ThreadPageNation";
import { ThreadDisplayCount } from "./ThreadDisplayCount";
import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { ThreadType } from "@kotobad/shared/src/types";
import { LabelListType } from "@kotobad/shared/src/types/label"

type Props = {
	initialThreads: ThreadType.ThreadType[];
	currentPage: number;
	totalCount: number;
};

export default function ThreadPageClient({
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
		<div className="flex flex-col items-center">
			<div className="w-full sm:max-w-[50%]">
				<div className="p-2">
					<div className="text-xl sm:text-2xl sm:text-3xl font-bold pb-1 sm:py-4">
						スレッド一覧
					</div>
					<CreateThread onCreated={handleCreated} />
					<div className="flex items-center my-2">
						<ThreadDisplayCount
							currentPage={currentPage}
							totalCount={totalCount}
						/>
						<ThreadPagination
							currentPage={currentPage}
							totalCount={totalCount}
							position="end"
						/>
					</div>
				</div>
				{totalCount === 0 ? (
					<div className="flex justify-center text-2xl">
						スレッドがありません
					</div>
				) : (
					<ThreadList threads={currentThreads} />
				)}
				<div className="flex justify-end">
					<ThreadPagination currentPage={currentPage} totalCount={totalCount} />
				</div>
			</div>
		</div>
	);
}
