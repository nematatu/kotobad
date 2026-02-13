"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { useEffect, useRef, useState } from "react";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Emoji } from "./ui/emojiPicker";

type PostListProps = {
	posts: PostListType;
};

type PostReactionType = Record<string, number>;
type ReactionsByPostType = Record<number, PostReactionType>;
type MyReactionByPostType = Record<number, Record<string, true>>;

type ReactionStateType = {
	reactionsByPost: ReactionsByPostType;
	myReactionByPost: MyReactionByPostType;
};

type ReactionCountProps = {
	count: number;
};

const ReactionCount = ({ count }: ReactionCountProps) => {
	const previousCountRef = useRef(count);

	useEffect(() => {
		if (count === previousCountRef.current) return;
		previousCountRef.current = count;
	}, [count]);

	return <span className="inline-block text-xs text-current">{count}</span>;
};

export const PostList = ({ posts }: PostListProps) => {
	const [reactionState, setReactionState] = useState<ReactionStateType>({
		reactionsByPost: {},
		myReactionByPost: {},
	});

	const handleReaction = (postId: number, emoji: string) => {
		setReactionState((prev) => {
			const currentPostReactions = { ...(prev.reactionsByPost[postId] ?? {}) };
			const currentMyReactions = { ...(prev.myReactionByPost[postId] ?? {}) };

			if (currentMyReactions[emoji]) {
				return prev;
			}

			currentPostReactions[emoji] = (currentPostReactions[emoji] ?? 0) + 1;

			return {
				reactionsByPost: {
					...prev.reactionsByPost,
					[postId]: currentPostReactions,
				},
				myReactionByPost: {
					...prev.myReactionByPost,
					[postId]: {
						...currentMyReactions,
						[emoji]: true,
					},
				},
			};
		});
	};

	return (
		<div className="radius-sm flex flex-col">
			{posts.map((post) => {
				const currentPostReactions =
					reactionState.reactionsByPost[post.id] ?? {};
				const myReactions = reactionState.myReactionByPost[post.id] ?? {};
				const reactionEntries = Object.entries(currentPostReactions).sort(
					([emojiA, countA], [emojiB, countB]) => {
						if (countA === countB) {
							return emojiA.localeCompare(emojiB);
						}
						return countB - countA;
					},
				);

				return (
					<div
						key={post.id}
						className={"p-4 min-h-14 flex items-center border bg-slate-50"}
					>
						<div className="flex flex-col w-full gap-2">
							<div className="flex items-center">
								<span className="text-gray-500 mr-2 text-sm">
									{post.localId ?? post.id}
								</span>
								<div className="flex items-center justify-center text-xs sm:text-sm whitespace-nowrap gap-2">
									<AuthorAvatar
										name={post.author.name}
										image={post.author.image}
										className="h-5 w-5"
										fallbackClassName="text-[8px]"
									/>
									<div className="flex gap-2 flex-wrap items-center text-xs text-gray-500">
										<span>{post.author.name}</span>
										<span>{getRelativeDate(post.createdAt)}</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col">
								<span className="block overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words ">
									{post.post}
								</span>
							</div>
							<div className="flex flex-wrap items-center gap-2">
								{reactionEntries.map(([emoji, count]) => {
									const isReacted = Boolean(myReactions[emoji]);
									return (
										<button
											type="button"
											key={`${post.id}:${emoji}`}
											className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 text-sm font-bold text-blue-500 transition-colors duration-150 ${
												isReacted
													? "bg-blue-300/20 hover:bg-blue-300/30 ring-1 ring-blue-400"
													: "hover:bg-slate-100"
											}`}
											onClick={() => handleReaction(post.id, emoji)}
											aria-label={`${emoji} をリアクション`}
										>
											<span>{emoji}</span>
											<ReactionCount count={count} />
										</button>
									);
								})}
								<Emoji
									selectedEmojis={myReactions}
									onReactAction={(emoji) => handleReaction(post.id, emoji)}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
