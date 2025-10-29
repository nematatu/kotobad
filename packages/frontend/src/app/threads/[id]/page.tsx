import { ThreadSchema } from "@kotobad/shared/src/schemas/thread";
import type { PostListType } from "@kotobad/shared/src/types/post";
import { notFound } from "next/navigation";
import { getPostByThreadId } from "@/lib/api/posts";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import ThreadDetailClient from "./components/ThreadDetailClient";

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const resolvedParams = await params;
	const threadId = resolvedParams.id;

	const targetUrl = new URL(String(threadId), getBffApiUrl("GET_THREAD_BY_ID"));
	const res = await fetch(targetUrl);
	const threadBody = await res.json();
	const targetThread = ThreadSchema.parse(threadBody);

	if (!targetThread) {
		return notFound();
	}

	const postsRes = await getPostByThreadId(Number(threadId));
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
