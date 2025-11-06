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
	const renderedparams = await params;
	const threadId = renderedparams.id;

	const baseUrl = await getBffApiUrl("GET_THREAD_BY_ID");
	const targetUrl = new URL(String(threadId), baseUrl);
	const res = await fetch(targetUrl);
	if (res.status === 404) {
		return notFound();
	}
	if (!res.ok) {
		throw new Error(
			`Failed to fetch thread detail: ${res.status} ${res.statusText}`,
		);
	}
	const threadBody = await res.json();
	const targetThread = ThreadSchema.parse(threadBody);

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
