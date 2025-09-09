"use client";

import { useEffect, useState } from "react";
import type { ThreadType } from "@b3s/shared/src/types/thread";
import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const [threadList, setThreadList] = useState<ThreadType[]>(threads);

	useEffect(() => {
		setThreadList(threads);
	}, [threads]);

	return (
		<div className="flex flex-col gap-y-4">
			{threadList.map((thread) => (
				<Card key={thread.id}>
					<CardHeader>
						<CardTitle>{thread.title}</CardTitle>
					</CardHeader>
					<CardContent>カードコンテンツ</CardContent>
					<CardFooter>
						<div>
							{thread.author.username}
							{thread.createdAt}
						</div>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};
