import type { TagType } from "@kotobad/shared/src/types";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import Link from "next/link";
import ChatIcon from "@/assets/threads/chat.svg";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const threadList: ThreadType[] = threads;
	const getLabelClass = (labelId: number) =>
		CategoryColorMap[labelId % CategoryColorMap.length];

	return (
		<div className="radius-sm flex flex-col sm:p-5">
			{threadList.map((thread, i) => {
				const href = `/threads/${thread.id}`;
				return (
					<Link
						href={href}
						key={thread.id}
						prefetch={i < 4}
						className={`group text-black visited:text-gray-400 p-4 min-h-14 flex items-center border cursor-pointer hover:bg-gray-100 hover:text-blue-500 visited:hover:text-blue-500 dark:hover:bg-gray-800 ${i % 2 === 0 ? "bg-gray-100 dark:bg-gray-950" : ""}`}
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
									<span className="text-sm">
										{getRelativeDate(thread.createdAt).relativeDate}
									</span>
									<ChatIcon
										className="mr-1"
										style={{ width: 12, height: 12 }}
									/>
									<div className="text-sm">{thread.postCount}</div>
								</div>

								<div className="mt-2 flex flex-wrap gap-2">
									{thread.threadTags?.map((tl: TagType.ThreadThreadTagType) => (
										<span
											key={tl.tagId}
											className={cn(
												"rounded-full px-2 py-0.5 text-xs font-medium text-gray-800",
												getLabelClass(tl.tagId),
											)}
										>
											{tl.tags.name}
										</span>
									))}
								</div>
							</div>
							{/* 右側：作成者 + 日付 */}
							<div className="flex flex-col items-end gap-y-1 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
								<span>作成者: {thread.author.name}</span>
								<span>{formatDate(thread.createdAt)}</span>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
};
