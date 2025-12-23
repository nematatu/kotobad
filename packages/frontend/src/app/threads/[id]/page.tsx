import { ThreadWithPostsSchema } from "@kotobad/shared/src/schemas/thread";
import { notFound } from "next/navigation";
import { getThreadWithPosts } from "@/app/threads/lib/getThreadWithPosts";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import ThreadDetailClient from "./components/ThreadDetailClient";
export const revalidate = 900;
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

	const normalizeThreadTags = (
		thread: Record<string, unknown>,
	): Record<string, unknown> => {
		if (Array.isArray(thread.threadTags)) {
			return thread;
		}
		if (Array.isArray(thread.threadLabels)) {
			const threadTags = thread.threadLabels
				.filter(
					(
						label,
					): label is {
						threadId: number;
						labelId: number;
						labels: { id: number; name: string };
					} =>
						typeof label === "object" &&
						label !== null &&
						"labels" in label &&
						"labelId" in label,
				)
				.map((label) => ({
					threadId: label.threadId,
					tagId: label.labelId,
					tags: label.labels,
				}));
			return { ...thread, threadTags };
		}
		return { ...thread, threadTags: [] };
	};

	const normalizedResponse =
		typeof response === "object" && response !== null && "thread" in response
			? {
					...response,
					thread: normalizeThreadTags(
						(response as { thread: Record<string, unknown> }).thread ?? {},
					),
				}
			: response;

	const { thread: targetThread, posts: targetPosts } =
		ThreadWithPostsSchema.parse(normalizedResponse);

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailClient thread={targetThread} initialPosts={targetPosts} />
		</div>
	);
}
