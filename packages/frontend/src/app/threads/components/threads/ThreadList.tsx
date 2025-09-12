"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ThreadType } from "@b3s/shared/src/types/thread";
import { formatDate } from "@/utils/date/formatDate";
import { getRelativeDate } from "@/utils/date/getRelativeDate";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const [threadList, setThreadList] = useState<ThreadType[]>(threads);

	useEffect(() => {
		setThreadList(threads);
	}, [threads]);

	return (
		<div className="radius-sm flex flex-col sm:p-5">
			{threadList.map((thread, i) => (
				<Link
					href={`/threads/${thread.id}`}
					key={thread.id}
					className={`group p-4 min-h-14 flex items-center border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${i % 2 === 0 ? "bg-gray-100 dark:bg-gray-900" : ""}`}
				>
					<div className="flex-col flex sm:flex-row justify-between text-sm sm:text-base w-full">
						{/* 左側：タイトル + 投稿日時 */}
						<div className="min-w-0 flex-1 pr-4">
							<span className="font-bold group-hover:text-blue-500 block overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words ">
								{thread.title}
							</span>
							<span className="text-gray-500 text-sm">
								{getRelativeDate(thread.createdAt)}
							</span>
						</div>
						{/* 右側：作成者 + 日付 */}
						<div className="flex flex-col items-end gap-y-1 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
							<span>作成者: {thread.author.username}</span>
							<span>{formatDate(thread.createdAt)}</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};
