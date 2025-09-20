import { notFound } from "next/navigation";
import { getAllThreads } from "@/lib/api/threads";
import { ThreadType } from "@b3s/shared/src/types";
import { getPostByThreadId } from "@/lib/api/posts";
import { PostListType } from "@b3s/shared/src/types/post";
import ThreadDetailClient from "./components/ThreadDetailClient";

type Props = {
	params: { id: string };
};

export default async function ThreadDetailPage({ params }: Props) {
	const threadRes = await getAllThreads();
	try {
		if ("error" in threadRes) {
			throw new Error(threadRes.error);
		}
	} catch (e: any) {
		return <div>{e.message}</div>;
	}
	const threads: ThreadType.ThreadType[] = threadRes.threads;

	const { id } = params;
	const threadId = Number(id);
	const targetThread = threads.find(
		(t: ThreadType.ThreadType) => t.id === threadId,
	);

	if (!targetThread) {
		return notFound();
	}

	const postsRes = await getPostByThreadId(threadId);
	try {
		if ("error" in postsRes) {
			throw new Error(postsRes.error);
		}
	} catch (e: any) {
		return <div>{e.message}</div>;
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
