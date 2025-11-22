"use client";

import { PERPAGE } from "@kotobad/shared/src/config/thread";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateThread } from "../create/CreateThread";
import { ThreadDisplayCount } from "./ThreadDisplayCount";
import { ThreadList } from "./ThreadList";
import { ThreadPagination } from "./ThreadPageNation";

type Props = {
	initialThreads: ThreadType[];
	currentPage: number;
	totalCount: number;
};

export default function ThreadPageClient({
	initialThreads,
	currentPage,
	totalCount,
}: Props) {
	const [threads, setThreads] = useState<ThreadType[]>([]);
	const router = useRouter();

	// // 初回表示後にアイドル時間で詳細データを先読みし、次の遷移を高速化
	// useEffect(() => {
	// 	const prefetchIds = initialThreads.slice(0, 3).map((t) => t.id);
	// 	if (prefetchIds.length === 0) return;
	//
	// 	const prefetch = () => {
	// 		prefetchIds.forEach((id) => {
	// 			fetch(`/threads/api/threads/getThreadById/${id}`, {
	// 				cache: "force-cache",
	// 			})
	// 				.catch(() => undefined);
	// 		});
	// 	};
	//
	// 	if (typeof window !== "undefined" && "requestIdleCallback" in window) {
	// 		window.requestIdleCallback(prefetch);
	// 		return;
	// 	}
	//
	// 	const timer = setTimeout(prefetch, 0);
	// 	return () => clearTimeout(timer);
	// }, [initialThreads]);
	//
	const handleCreated = (newThread: ThreadType) => {
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
						スレッドがありません...
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
