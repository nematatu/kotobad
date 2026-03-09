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
		<div className="flex flex-col gap-3">
			{threadList.map((thread) => {
				const href = `/threads/${thread.id}`;
				const authorHref = `/users/${encodeURIComponent(thread.authorId)}`;
				const relativeDate = getRelativeDate(thread.createdAt);
				return (
					<div
						key={thread.id}
						className="group relative z-0 flex items-start gap-4 rounded-sm border border-gray-200 bg-white p-4 text-gray-900 transition [@media(hover:hover)]:hover:border-gray-300 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:has-[.thread-card-nohover:hover]:bg-white"
					>
						<Link
							href={authorHref}
							aria-label={`ユーザー: ${thread.author.name}`}
							className="relative z-10 shrink-0"
						>
							<AuthorAvatar
								name={thread.author.name}
								image={thread.author.image}
								className="w-7 h-7 bg-white"
								fallbackClassName="text-xs"
							/>
						</Link>
						<div className="min-w-0 flex-1 space-y-2">
							<Link
								href={href}
								aria-label={`スレッド: ${thread.title}`}
								className="block after:absolute after:inset-0 after:rounded-sm after:z-0 after:content-['']"
							>
								<div className="relative z-10">
									<div className="flex gap-2 flex-wrap items-center text-xs text-gray-500">
										<span>{thread.author.name}</span>
										<span>{relativeDate}</span>
									</div>
									<h3 className="mt-1 block text-base font-bold line-clamp-2 sm:text-lg">
										{highlightText(thread.title, highlightQuery)}
									</h3>
								</div>
							</Link>
							<div className="flex flex-col space-y-2">
								<div className="relative z-10 flex flex-wrap gap-3 self-start">
									{thread.threadTags?.map((tag) => (
										<Link
											href="/"
											key={tag.id}
											className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 [@media(hover:hover)]:hover:underline"
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
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
