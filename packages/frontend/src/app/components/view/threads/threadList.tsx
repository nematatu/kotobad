"use client";

import type { TagType } from "@kotobad/shared/src/types";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import ChatIcon from "@/assets/threads/chat.svg";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type ThreadListType = {
	threads: ThreadType[];
};

export const ThreadList = ({ threads }: ThreadListType) => {
	const threadList: ThreadType[] = threads;
	const router = useRouter();
	const prefetched = useRef(new Set<string>());

	const handlePrefetch = (href: string) => {
		if (typeof window === "undefined") return;
		if (!window.matchMedia("(hover: hover)").matches) return;
		if (prefetched.current.has(href)) return;
		prefetched.current.add(href);
		router.prefetch(href);
	};

	return (
		<div className="">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{threadList.map((thread) => {
					const relative = getRelativeDate(thread.createdAt);
					const href = `/threads/${thread.id}`;
					return (
						<Link
							href={href}
							key={thread.id}
							prefetch={false}
							onMouseEnter={() => handlePrefetch(href)}
							className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:text-blue-600 visited:text-gray-500 visited:hover:text-blue-600"
						>
							<div className="min-w-0 flex-1">
								<div className="text-base font-semibold leading-6 group-hover:text-blue-600 sm:text-lg md:text-xl">
									<span className="block text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words">
										{thread.title}
									</span>
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
									<span>
										{relative.isDisplay
											? relative.relativeDate
											: formatDate(thread.createdAt)}
									</span>
									<div className="flex items-center gap-1">
										<ChatIcon width={16} />
										<span>{thread.postCount}</span>
									</div>
									<div className="flex items-center">
										<AuthorAvatar
											name={thread.author.name}
											image={thread.author.image}
											className="h-6 w-6 border-gray-300"
											fallbackClassName="text-[8px]"
										/>
										<span className="sr-only">{thread.author.name}</span>
									</div>
								</div>
								{thread.threadTags?.length ? (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{thread.threadTags?.map(
											(tl: TagType.ThreadThreadTagType) => (
												<span
													key={tl.tagId}
													className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
												>
													{tl.tags.name}
												</span>
											),
										)}
									</div>
								) : null}
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};
