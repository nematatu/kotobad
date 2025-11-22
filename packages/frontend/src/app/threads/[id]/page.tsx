import { ThreadWithPostsSchema } from "@kotobad/shared/src/schemas/thread";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/config/apiUrls";
import ThreadDetailClient from "./components/ThreadDetailClient";
export const revalidate = 900;

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const renderedparams = await params;
	const threadId = renderedparams.id;

	const getThreadsBaseUrl = await getApiUrl("GET_THREAD_WITH_POSTS");
	const getThreadTargetUrl = new URL(String(threadId), getThreadsBaseUrl);

	const response = await fetch(getThreadTargetUrl, {
		cache: "force-cache",
		next: {
			revalidate,
			tags: ["threads", `thread:${threadId}`],
		},
	});

	if (response.status === 404) {
		return notFound();
	}
	if (!response.ok) {
		throw new Error(
			`Failed to fetch thread detail: ${response.status} ${response.statusText}`,
		);
	}

	const combinedBody = await response.json();
	const { thread: targetThread, posts: targetPosts } =
		ThreadWithPostsSchema.parse(combinedBody);

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailClient thread={targetThread} initialPosts={targetPosts} />
		</div>
	);
}
