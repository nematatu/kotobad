import { PostListSchema } from "@kotobad/shared/src/schemas/post";
import { ThreadSchema } from "@kotobad/shared/src/schemas/thread";
import { notFound } from "next/navigation";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import ThreadDetailClient from "./components/ThreadDetailClient";

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const renderedparams = await params;
	const threadId = renderedparams.id;

	const getThreadsBaseUrl = await getBffApiUrl("GET_THREAD_BY_ID");
	const getThreadTargetUrl = new URL(String(threadId), getThreadsBaseUrl);
	const getThreadsRes = await fetch(getThreadTargetUrl);
	if (getThreadsRes.status === 404) {
		return notFound();
	}
	if (!getThreadsRes.ok) {
		throw new Error(
			`Failed to fetch thread detail: ${getThreadsRes.status} ${getThreadsRes.statusText}`,
		);
	}
	const threadBody = await getThreadsRes.json();
	const targetThread = ThreadSchema.parse(threadBody);

	const getPostsBaseUrl = await getBffApiUrl("GET_POSTS_BY_THREADID");
	const getPostsTargetUrl = new URL(String(threadId), getPostsBaseUrl);
	const getPostsRes = await fetch(getPostsTargetUrl);
	if (getPostsRes.status === 404) {
		return notFound();
	}
	if (!getPostsRes.ok) {
		throw new Error(
			`Failed to fetch thread detail: ${getPostsRes.status} ${getPostsRes.statusText}`,
		);
	}
	const postsBody = await getPostsRes.json();
	const targetPosts = PostListSchema.parse(postsBody);

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailClient thread={targetThread} initialPosts={targetPosts} />
		</div>
	);
}
