import { PERPAGE } from "@kotobad/shared/src/config/thread";
import type { TagListType } from "@kotobad/shared/src/types/tag";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
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
	currentPage,
	totalCount,
}: Props) {
	const currentThreads = [...initialThreads].slice(0, PERPAGE);
	return (
		<div className="flex flex-col items-center w-full lg:max-w-[50%]">
			<div className="w-full px-3 pt-5 pb-2 space-y-2">
				<div className="text-xl font-bold">スレッド一覧</div>
				<p className="text-slate-500 text-xs">
					バドミントンの熱い議論に参加しましょう。
				</p>
			</div>
			<div className="">
				{totalCount === 0 ? (
					<div className="flex justify-center text-2xl">
						スレッドがありません...
					</div>
				) : (
					<ThreadList threads={currentThreads} />
				)}
				<div className="flex flex-col items-center my-3 space-y-3">
					<ThreadPagination currentPage={currentPage} totalCount={totalCount} />
					<ThreadDisplayCount
						currentPage={currentPage}
						totalCount={totalCount}
					/>
				</div>
			</div>
		</div>
	);
}
