"use client";

import { PERPAGE } from "@kotobad/shared/src/config/thread";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useRouter } from "next/navigation";
import { CreateThread } from "../create/CreateThread";
import { ThreadDisplayCount } from "./ThreadDisplayCount";
import { ThreadList } from "./ThreadList";
import { ThreadPagination } from "./ThreadPageNation";

type Props = {
	initialThreads: ThreadType[];
	initialTags?: TagListType;
	currentPage: number;
	totalCount: number;
};

export default function ThreadPageClient({
	initialThreads,
	initialTags,
	currentPage,
	totalCount,
}: Props) {
	const router = useRouter();

	const handleCreated = () => {
		if (currentPage === 1) {
			router.refresh();
		} else {
			router.push("/threads?page=1");
		}
	};

	const currentThreads = [...initialThreads].slice(0, PERPAGE);
	return (
		<div className="flex flex-col items-center">
			<div className="w-full sm:max-w-[50%]">
				<div className="p-2">
					<div className="text-xl sm:text-2xl sm:text-3xl font-bold pb-1 sm:py-4">
						スレッド一覧
					</div>
					<CreateThread onCreated={handleCreated} initialTags={initialTags} />
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
