"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ThreadType } from "@b3s/shared/src/types/thread";
import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
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
		<div className="flex flex-col gap-y-4 sm:p-5">
			{threadList.map((thread) => (
				<Card
					key={thread.id}
					className="p-2 border-2 cursor-pointer dark:hover:border-blue-400 hover:border-blue-400"
				>
					<Link href={`/threads/${thread.id}`}>
						<div className="flex items-center">
							<CardHeader className="text-xl sm:text-3xl text-blue-400 underline ">
								<CardTitle>{thread.title}</CardTitle>
							</CardHeader>
							<div className="flex flex-col items-end text-gray-400">
								{getRelativeDate(thread.createdAt)}
							</div>
						</div>
						<CardContent>カードコンテンツ</CardContent>
						<CardFooter>
							<div className="w-full flex justify-end">
								<div className="flex flex-col items-end gap-y-1">
									<span>作成者: {thread.author.username}</span>
									<span className="text-sm text-gray-400">
										{formatDate(thread.createdAt)}
									</span>
								</div>
							</div>
						</CardFooter>
					</Link>
				</Card>
			))}
		</div>
	);
};
