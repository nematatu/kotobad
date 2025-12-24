import type { TagType } from "@kotobad/shared/src/types";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import Link from "next/link";
import ChatIcon from "@/assets/threads/chat.svg";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const threadList: ThreadType[] = threads;

	return (
		<div className="max-w-4xl mx-auto">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{threadList.map((thread) => {
					const relative = getRelativeDate(thread.createdAt);
					return (
						<Link
							href={`/threads/${thread.id}`}
							key={thread.id}
							className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:text-blue-600 visited:text-gray-500 visited:hover:text-blue-600"
						>
							<div className="min-w-0 flex-1">
								<div className="text-base font-semibold leading-6 group-hover:text-blue-600 sm:text-lg md:text-xl">
									<span className="block text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words">
										{thread.title}
									</span>
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
									<span>
										{relative.isDisplay
											? relative.relativeDate
											: formatDate(thread.createdAt)}
									</span>
									<div className="flex items-center gap-1">
										<ChatIcon width={16} />
										<span>{thread.postCount}</span>
									</div>
									<span>{thread.author.username}</span>
								</div>
								{thread.threadTags?.length ? (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{thread.threadTags?.map(
											(tl: TagType.ThreadThreadTagType) => (
												<span
													key={tl.tagId}
													className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
												>
													{tl.tags.name}
												</span>
											),
										)}
									</div>
								) : null}
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};
