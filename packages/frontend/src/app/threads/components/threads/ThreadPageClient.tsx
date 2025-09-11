"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreadList } from "./ThreadList";
import { CreateThreadForm } from "./CreateThreadForm";
import { ThreadType } from "@b3s/shared/src/types";

type Props = {
	initialThreads: ThreadType.ThreadType[];
	currentPage: number;
};

export default function ThreadPageClient({
	initialThreads,
	currentPage,
}: Props) {
	const [threads, setThreads] = useState<ThreadType.ThreadType[]>([]);
	const router = useRouter();

	const handleCreated = (newThread: ThreadType.ThreadType) => {
		if (currentPage === 1) {
			setThreads((prev) => [newThread, ...prev]);
		} else {
			router.push("/threads?page=1");
		}
	};

	const currentThreads = [...threads, ...initialThreads].slice(0, 3);
	return (
		<div className="px-5">
			<div className="text-3xl font-bold pb-6">スレッド一覧</div>
			<CreateThreadForm onCreated={handleCreated} />
			<ThreadList threads={currentThreads} />
		</div>
	);
}
