import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { notFound } from "next/navigation";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { TagList } from "../components/view/tag/tagList";
import { getThreadById } from "../lib/getThreadById";
import { BackToThreadListHeaderButton } from "./components/BackToThreadListHeaderButton";
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
		<>
			<div
				className="hidden sm:block fixed left-3 z-40"
				style={{ top: "calc(var(--header-height, 0px) + 0.5rem)" }}
			>
				<BackToThreadListHeaderButton className="hover:bg-white" />
			</div>
			<div className="mx-auto w-full max-w-6xl sm:p-3 sm:p-4">
				<section>
					<ThreadDetailHeader threadHeaderData={threadHeaderData} />
				</section>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
					<div className="space-y-4 sm:space-y-12">
						<div className="min-w-0 space-y-4">
							<ThreadPostsStream
								threadId={threadId}
								highlightPostId={highlightPostId}
							/>
						</div>
					</div>
					<aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-height,0px)+0.75rem)]">
						<div className="hidden sm:block rounded-lg bg-white p-3">
							<div className="flex flex-col gap-4">
								<p className="text-gray-400 text-xs sm:text-sm">
									{formatDate(threadHeaderData.createdAt, {
										withTime: false,
									})}
								</p>
								{threadHeaderData.threadTags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										<TagList tags={threadHeaderData.threadTags} />
									</div>
								)}
							</div>
						</div>
						<div className="hidden sm:block">
							<ThreadAuthorPanel thread={threadHeaderData} />
						</div>
					</aside>
				</div>
			</div>
		</>
	);
}
