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
		<div className="max-w-4xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{threadList.map((thread) => (
					<Link
						href={`/threads/${thread.id}`}
						key={thread.id}
						className={`flex items-cener group bg-blue-50 p-4 min-h-14 border cursor-pointer hover:bg-gray-100 rounded-md`}
					>
						<div className="flex-col sm:flex-row w-full text-sm sm:text-base">
							<span className="border bg-white w-full p-3 font-bold text-md sm:text-2xl group-hover:text-blue-500 block text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words min-h-20 rounded-sm">
								{thread.title}
							</span>
							<div className="px-4 space-y-2 mt-3">
								<div className="flex items-center space-x-4 text-gray-500">
									<div className="flex items-center space-x-1">
										<ChatIcon width={17} />
										<p className="text-md">{thread.postCount}</p>
									</div>

									<p className="flex flex-col items-end gap-y-1 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
										<span>{thread.author.username}</span>
									</p>
								</div>

								<div className="text-sm text-gray-500">
									{getRelativeDate(thread.createdAt).isDisplay ? (
										<span className="text-sm">
											{getRelativeDate(thread.createdAt).relativeDate}
										</span>
									) : (
										<span>{formatDate(thread.createdAt)}</span>
									)}
								</div>
							</div>
							{thread.threadLabels?.map(
								(tl: LabelType.ThreadThreadLabelType) => (
									<span key={tl.labelId} className="">
										{tl.labels.name}
									</span>
								),
							)}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};
