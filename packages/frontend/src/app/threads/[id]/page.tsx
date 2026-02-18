import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ActionLink from "@/components/common/button/ActionLink";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getThreadById } from "../lib/getThreadById";
import { ThreadDetailHeader } from "./components/ThreadDetailHeader";
import { ThreadPostsStream } from "./components/ThreadPostsStream";
export const dynamic = "force-dynamic";

export type Props = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ postId?: string }>;
};

export default async function ThreadDetailPage({
	params,
	searchParams,
}: Props) {
	const renderedparams = await params;
	const renderedSearchParams = await searchParams;
	const threadId = Number(renderedparams.id);
	const parsedHighlightPostId = Number(renderedSearchParams.postId);
	const highlightPostId =
		Number.isInteger(parsedHighlightPostId) && parsedHighlightPostId > 0
			? parsedHighlightPostId
			: null;

	if (!Number.isInteger(threadId) || threadId <= 0) {
		return notFound();
	}

	let threadHeaderData: ThreadType;
	try {
		threadHeaderData = await getThreadById(String(threadId));
	} catch (error) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			return notFound();
		}
		throw error;
	}

	return (
		<div className="p-1 sm:p-4">
			<ActionLink
				item={{
					icon: ArrowLeft,
					label: "スレッド一覧へ",
					href: "/threads",
				}}
			/>
			<ThreadDetailHeader threadHeaderData={threadHeaderData} />
			<ThreadPostsStream
				threadId={threadId}
				initialPostCount={threadHeaderData.postCount}
				highlightPostId={highlightPostId}
			/>
		</div>
	);
}
