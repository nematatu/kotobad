import type { PostListType } from "@kotobad/shared/src/types/post";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { notFound } from "next/navigation";
import { getPostByThreadId } from "@/lib/api/posts";
import { getAllThreads } from "@/lib/api/threads";
import ThreadDetailClient from "./components/ThreadDetailClient";

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const resolvedParams = await params;
	const threadRes = await getAllThreads();
	if ("error" in threadRes) {
		return <div>{threadRes.error}</div>;
	}
	const threads: ThreadType[] = threadRes.threads;

	const id = resolvedParams.id;
	const threadId = Number(id);
	const targetThread = threads.find((t) => t.id === threadId);

	if (!targetThread) {
		return notFound();
	}

	const postsRes = await getPostByThreadId(threadId);
	if ("error" in postsRes) {
		return <div>{postsRes.error}</div>;
	}

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailClient
				thread={targetThread}
				initialPosts={postsRes as PostListType}
			/>
		</div>
	);
}
