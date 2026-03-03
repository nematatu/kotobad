import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ActionLink from "@/components/common/button/ActionLink";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { getThreadById } from "../lib/getThreadById";
import { ThreadAuthorPanel } from "./components/ThreadAuthorPanel";
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
		<div className="mx-auto w-full max-w-6xl p-1 sm:p-4">
			<div
				className="hidden sm:block fixed z-40 sm:left-3"
				style={{ top: "calc(var(--header-height, 0px) + 0.5rem)" }}
			>
				<ActionLink
					item={{
						icon: ArrowLeft,
						label: "スレッド一覧へ",
						href: "/threads",
					}}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
				<div className="min-w-0 space-y-4 rounded-lg bg-white p-2 sm:p-4">
					<section>
						<ThreadDetailHeader threadHeaderData={threadHeaderData} />
					</section>
					<section>
						<ThreadPostsStream
							threadId={threadId}
							initialPostCount={threadHeaderData.postCount}
							highlightPostId={highlightPostId}
						/>
					</section>
				</div>
				<aside className="lg:sticky lg:top-[calc(var(--header-height,0px)+0.75rem)]">
					<ThreadAuthorPanel thread={threadHeaderData} />
				</aside>
			</div>
		</div>
	);
}
