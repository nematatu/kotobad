import { ThreadWithPostsSchema } from "@kotobad/shared/src/schemas/thread";
import { notFound } from "next/navigation";
import { getThreadWithPosts } from "@/app/threads/lib/getThreadWithPosts";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import ThreadDetailClient from "./components/ThreadDetailClient";
export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true; // ビルド時に静的生成せず、初回アクセスでISR生成

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const renderedparams = await params;
	const threadId = renderedparams.id;

	let response;
	try {
		response = await getThreadWithPosts(threadId);
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			return notFound();
		}
		throw error;
	}

	const { thread: targetThread, posts: targetPosts } =
		ThreadWithPostsSchema.parse(response);

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailClient thread={targetThread} initialPosts={targetPosts} />
		</div>
	);
}
