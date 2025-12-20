import type { LabelType } from "@kotobad/shared/src/types";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import Link from "next/link";
import ChatIcon from "@/assets/threads/chat.svg";
import { formatDate } from "@/utils/date/formatDate";
import { getRelativeDate } from "@/utils/date/getRelativeDate";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const threadList: ThreadType[] = threads;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{threadList.map((thread) => (
				<Link
					href={`/threads/${thread.id}`}
					key={thread.id}
					className={`group dark:text-gray-300 p-4 min-h-14 flex items-center border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 `}
				>
					<div className="flex-col flex sm:flex-row justify-between text-sm sm:text-base w-full">
						{/* 左側：タイトル + 投稿日時 */}
						<div className="min-w-0 flex-1 pr-4">
							<div className="flex space-x-4">
								<span className="font-bold text-lg sm:text-xl group-hover:text-blue-500 block  text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words">
									{thread.title}
								</span>
							</div>
							<div className="flex items-center space-x-1 text-gray-500">
								<ChatIcon width={15} />
								<div className="text-sm">{thread.postCount}</div>

								{getRelativeDate(thread.createdAt).isDisplay ? (
									<span className="text-sm">
										{getRelativeDate(thread.createdAt).relativeDate}
									</span>
								) : (
									<span>{formatDate(thread.createdAt)}</span>
								)}
							</div>

							{thread.threadLabels?.map(
								(tl: LabelType.ThreadThreadLabelType) => (
									<span key={tl.labelId} className="">
										{tl.labels.name}
									</span>
								),
							)}
						</div>

						<div className="flex flex-col items-end gap-y-1 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
							<span>{thread.author.username}</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};
