"use client";

import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { ArrowRight } from "lucide-react";
import {
	LikeButton,
	THREAD_LIST_META_CHIP_CLASS,
} from "@/app/threads/[id]/components/likeButton";
import ChatIcon from "@/assets/threads/chat.svg";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
import { YouTubeEmbedsFromText } from "@/components/common/YouTubeEmbedsFromText";
import { collectYouTubeUrlsFromText } from "@/components/common/youtubeUrlUtils";
import { highlightText } from "@/components/feature/header/component/headerSearch/highlightText";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Button } from "@/components/ui/button";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";
import { ThreadPostImage } from "../shared/ThreadPostImage";

type ThreadListType = {
	threads: ThreadType[];
	highlightQuery?: string;
};

export const ThreadList = ({
	threads,
	highlightQuery = "",
}: ThreadListType) => {
	const threadList: ThreadType[] = threads;
	const router = useViewTransitionRouter();
	const firstImageThreadIndex = threadList.findIndex(
		(thread) => (thread.imageUrls ?? []).length > 0,
	);

	return (
		<div className="flex flex-col">
			{threadList.map((thread, threadIndex) => {
				const href = `/threads/${thread.id}`;
				const authorHref = `/users/${encodeURIComponent(thread.authorId)}`;
				const relativeDate = getRelativeDate(thread.createdAt);
				const threadPreviewImageUrls = (thread.imageUrls ?? []).slice(0, 2);
				const hasYouTubeInTitle =
					collectYouTubeUrlsFromText(thread.title).length > 0;
				const previewImageContainerClassName =
					"w-[9rem] sm:w-[10.5rem] aspect-[4/3] rounded-lg";
				const previewImageClassName = "h-full w-full";
				const renderThreadTitle = () => (
					<h3 className="block font-bold line-clamp-2 sm:text-lg">
						{hasYouTubeInTitle ? (
							<AutoLinkText text={thread.title} hideYouTubeUrls />
						) : (
							highlightText(thread.title, highlightQuery)
						)}
					</h3>
				);
				const renderThreadImages = () =>
					threadPreviewImageUrls.length > 0 ? (
						<div
							className={
								threadPreviewImageUrls.length > 1
									? "mt-2 grid max-w-[19rem] sm:max-w-[22rem] grid-cols-2 gap-2 pointer-events-auto"
									: "mt-2 max-w-[14rem] sm:max-w-[17rem] pointer-events-auto"
							}
						>
							{threadPreviewImageUrls.map((imageUrl, imageIndex) => {
								const isTopLcpCandidate =
									threadIndex === firstImageThreadIndex && imageIndex === 0;
								return (
									<ThreadPostImage
										key={imageUrl}
										imageUrl={imageUrl}
										thumbnailPreset="threadList"
										containerClassName={previewImageContainerClassName}
										imageClassName={previewImageClassName}
										loading={isTopLcpCandidate ? "eager" : "lazy"}
										fetchPriority={isTopLcpCandidate ? "high" : undefined}
									/>
								);
							})}
						</div>
					) : null;
				return (
					<div
						key={thread.id}
						className="thread-list-card group relative z-0 flex items-start gap-4 border-b border-gray-200 bg-white px-4 pb-3 pt-4 text-gray-900 transition hover:border-gray-300 hover:bg-gray-50 sm:cursor-pointer"
						role="link"
						tabIndex={0}
						aria-label={`スレッドへ移動: ${thread.title}`}
						onClick={(event) => {
							const target = event.target as HTMLElement;
							if (
								target.closest("a, button, [data-no-card-link='true']") !== null
							) {
								return;
							}
							router.push(href);
						}}
						onKeyDown={(event) => {
							if (event.key !== "Enter" && event.key !== " ") {
								return;
							}
							const target = event.target as HTMLElement;
							if (
								target.closest("a, button, [data-no-card-link='true']") !== null
							) {
								return;
							}
							event.preventDefault();
							router.push(href);
						}}
					>
						<div className="min-w-0 flex-1 space-y-3">
							<div className="flex items-center gap-2 text-gray-500 hover:text-gray-600">
								<Link
									href={authorHref}
									aria-label={`ユーザー: ${thread.author.name}`}
									className="shrink-0 inline-flex min-h-7 items-center gap-1 rounded px-1 text-xs leading-none pointer-events-auto"
								>
									<AuthorAvatar
										name={thread.author.name}
										image={thread.author.image}
										className="w-5 h-5 bg-white"
										fallbackClassName="text-xs"
									/>
									<span>{thread.author.name}</span>
								</Link>

								<span className="text-xs">{relativeDate}</span>
							</div>
							<div className="relative z-10">
								<div className="block space-y-2 sm:hidden">
									{renderThreadTitle()}
								</div>
								<div className="hidden space-y-2 sm:block">
									<Link
										href={href}
										aria-label={`スレッド: ${thread.title}`}
										className="inline-block"
									>
										{renderThreadTitle()}
									</Link>
								</div>
								<div className="pointer-events-auto">
									<YouTubeEmbedsFromText
										text={thread.title}
										playerClassName="w-full sm:max-w-[22rem]"
										playerNoCardLink
									/>
								</div>
								{renderThreadImages()}
							</div>
							<div className="flex flex-col space-y-2">
								<div className="relative z-10 flex flex-wrap gap-3 self-start">
									{thread.threadTags?.map((tag) => (
										<Link
											href="/"
											key={tag.id}
											className="thread-list-tag-link inline-flex items-center gap-1 text-xs font-semibold text-blue-600 [@media(hover:hover)]:hover:underline"
										>
											#{tag.name}
										</Link>
									))}
								</div>
								<div className="relative z-10 flex flex-wrap items-center gap-2 pointer-events-none">
									<div className={THREAD_LIST_META_CHIP_CLASS}>
										<ChatIcon
											className="h-4 w-4 text-[#ABBAC2]"
											style={{ strokeWidth: 1.9 }}
										/>
										{thread.postCount > 0 && (
											<span className="text-[10px] leading-none">
												{thread.postCount}
											</span>
										)}
									</div>
									<LikeButton
										threadId={thread.id}
										initialLikeCount={thread.likeCount}
										initialLikedByMe={thread.likedByMe}
										size="compact"
									/>
									<Button
										asChild
										variant="ghost"
										rounded="lg"
										enableClickAnimation
										className=" sm:hidden ml-auto shrink-0 pointer-events-auto z-10 h-[45px] w-[69px] gap-1 bg-blue-500/90 px-2 text-[13px] font-semibold text-slate-100 dark:bg-blue-500 sm:h-9 sm:w-[78px] sm:gap-1.5 sm:px-2.5 sm:text-[14px]"
									>
										<Link href={href} aria-label={`みる: ${thread.title}`}>
											みる
											<ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
