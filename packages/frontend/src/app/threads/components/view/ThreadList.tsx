"use client";

import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { useCallback, useState } from "react";
import ChatIcon from "@/assets/threads/chat.svg";
import { Heart } from "@/components/animate-ui/icons/heart";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const threadList: ThreadType[] = threads;
	const [likedByThreadId, setLikedByThreadId] = useState<
		Record<number, boolean>
	>({});
	const toggleLike = useCallback((threadId: number) => {
		setLikedByThreadId((prev) => ({
			...prev,
			[threadId]: !prev[threadId],
		}));
	}, []);

	return (
		<div className="flex flex-col gap-3">
			{threadList.map((thread) => {
				const href = `/threads/${thread.id}`;
				const authorHref = `/users/${thread.authorId}`;
				const relativeDate = getRelativeDate(thread.createdAt);
				const isLiked = !!likedByThreadId[thread.id];
				return (
					<div
						key={thread.id}
						className="group relative z-0 flex items-start gap-4 rounded-sm border border-gray-200 bg-white p-4 text-gray-900 transition hover:border-gray-300 hover:bg-gray-50 has-[.thread-card-nohover:hover]:bg-white"
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
										{thread.title}
									</h3>
								</div>
							</Link>
							<div className="flex flex-col space-y-2">
								<div className="relative z-10 flex flex-wrap gap-3">
									{thread.threadTags?.map((tl) => (
										<Link
											href="/"
											key={tl.tagId}
											className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
										>
											#{tl.tags.name}
										</Link>
									))}
								</div>
								<div className="relative z-10 flex flex-wrap space-x-2 pointer-events-none">
									<button
										type="button"
										aria-pressed={isLiked}
										aria-label={isLiked ? "いいねを解除" : "いいね"}
										onPointerDown={(event) => {
											if (event.button !== 0) return;
											toggleLike(thread.id);
										}}
										onClick={(event) => {
											if (event.detail !== 0) return;
											toggleLike(thread.id);
										}}
										className="thread-card-nohover inline-flex items-center gap-[5px] rounded-sm bg-gray-100 px-2 py-1 text-gray-800 font-semibold leading-none pointer-events-auto cursor-pointer"
									>
										<Heart
											className={
												isLiked
													? "h-3 w-3 text-red-500"
													: "h-3 w-3 text-gray-600"
											}
											animation="fill"
											animate={isLiked ? "fill" : false}
										/>
										<span className="text-[10px] leading-none transition-colors">
											{thread.postCount}
										</span>
									</button>
									<div className="thread-card-nohover inline-flex items-center gap-[5px] rounded-sm bg-gray-100 px-2 py-1 text-gray-800 font-semibold leading-none pointer-events-auto">
										<ChatIcon className="h-3 w-3" />
										<span className="text-[10px] leading-none">
											{thread.postCount}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
