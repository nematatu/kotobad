"use client";

import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import {
	LikeButton,
	THREAD_LIST_META_CHIP_CLASS,
} from "@/app/threads/[id]/components/likeButton";
import ChatIcon from "@/assets/threads/chat.svg";
import { Link } from "@/components/common/Link";
import { highlightText } from "@/components/feature/header/component/headerSearch/highlightText";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
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

	return (
		<div className="flex flex-col">
			{threadList.map((thread) => {
				const href = `/threads/${thread.id}`;
				const authorHref = `/users/${encodeURIComponent(thread.authorId)}`;
				const relativeDate = getRelativeDate(thread.createdAt);
				const threadPreviewImageUrls = (thread.imageUrls ?? []).slice(0, 2);
				const renderThreadSummary = () => (
					<div className="relative z-10">
						<h3 className="block font-bold line-clamp-2 sm:text-lg">
							{highlightText(thread.title, highlightQuery)}
						</h3>
						{threadPreviewImageUrls.length > 0 && (
							<div
								className={
									threadPreviewImageUrls.length > 1
										? "mt-2 grid max-w-[15rem] grid-cols-2 gap-2"
										: "mt-2 max-w-[12rem]"
								}
							>
								{threadPreviewImageUrls.map((imageUrl) => (
									<ThreadPostImage
										key={imageUrl}
										imageUrl={imageUrl}
										containerClassName="h-20"
										imageClassName="h-full"
									/>
								))}
							</div>
						)}
					</div>
				);
				return (
					<div
						key={thread.id}
						className="thread-list-card group relative z-0 flex items-start gap-4 border-b border-gray-200 bg-white px-4 pb-3 pt-2 text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
					>
						<div className="min-w-0 flex-1 space-y-1">
							<span className="text-[10px] text-gray-500">{relativeDate}</span>
							<div className="block sm:hidden">{renderThreadSummary()}</div>
							<Link
								href={href}
								aria-label={`スレッド: ${thread.title}`}
								className="hidden sm:block after:absolute after:inset-0 after:rounded-sm after:z-0 after:content-['']"
							>
								{renderThreadSummary()}
							</Link>
							<div className="flex flex-col space-y-2">
								<div className="relative z-10 flex flex-wrap gap-3 self-start">
									{thread.threadTags?.map((tag) => (
										<Link
											href="/"
											key={tag.id}
											className="thread-list-tag-link inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
										>
											#{tag.name}
										</Link>
									))}
								</div>
								<div className="relative z-10 flex flex-wrap items-center gap-2 pointer-events-none">
									<div className={THREAD_LIST_META_CHIP_CLASS}>
										<ChatIcon className="h-3 w-3" />
										<span className="text-[10px] leading-none">
											{thread.postCount}
										</span>
									</div>
									<LikeButton
										threadId={thread.id}
										initialLikeCount={thread.likeCount}
										initialLikedByMe={thread.likedByMe}
										size="compact"
									/>
									<Link
										href={authorHref}
										aria-label={`ユーザー: ${thread.author.name}`}
										className="z-10 ml-auto shrink-0 flex self-end items-center gap-1 text-[10px] text-gray-500/80 hover:text-gray-600"
									>
										<AuthorAvatar
											name={thread.author.name}
											image={thread.author.image}
											className="w-5 h-5 bg-white"
											fallbackClassName="text-xs"
										/>
										<span>{thread.author.name}</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
