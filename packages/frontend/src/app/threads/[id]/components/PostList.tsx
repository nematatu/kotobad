"use client";

import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { PostListType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { useEffect, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { DropDownMenu } from "@/components/feature/dropDownMenu/dropDownMenu";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { Emoji } from "./ui/emojiPicker";

type PostListProps = {
	posts: PostListType;
	highlightPostId: number | null;
};

type ReactionCountProps = {
	count: number;
};

const ReactionCount = ({ count }: ReactionCountProps) => {
	const [isPopping, setIsPopping] = useState(false);
	const previousCountRef = useRef(count);

	useEffect(() => {
		if (count === previousCountRef.current) return;
		previousCountRef.current = count;
		setIsPopping(true);
		const timeoutId = window.setTimeout(() => {
			setIsPopping(false);
		}, 220);
		return () => window.clearTimeout(timeoutId);
	}, [count]);

	return (
		<span
			className={`inline-block text-xs text-current ${
				isPopping ? "animate-reaction-count-pop" : ""
			}`}
		>
			{count}
		</span>
	);
};

export const PostList = ({ posts, highlightPostId }: PostListProps) => {
	const [localPosts, setLocalPosts] = useState<PostListType>(posts);
	const { data: reactionOptions = [] } = useSWRImmutable(
		"GET_REACTION_OPTIONS",
		async () => {
			const endpoint = await getBffApiUrl("GET_REACTION_OPTIONS");
			const raw = await BffFetcher<unknown>(endpoint, {
				method: "GET",
			});
			return ReactionOptionListSchema.parse(raw);
		},
	);
	const reactionCodes = reactionOptions.map((item) => item.reactionCode);

	useEffect(() => {
		setLocalPosts(posts);
	}, [posts]);

	useEffect(() => {
		if (!highlightPostId) return;
		const targetElement = document.getElementById(
			`post-${highlightPostId}`,
		) as HTMLElement | null;
		if (!targetElement) return;

		targetElement.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "nearest",
		});
	}, [highlightPostId]);

	const handleReaction = async (postId: number, reactionCode: string) => {
		const post = localPosts.find((item) => item.id === postId);
		if (!post) return;

		const current = post.reactions.find(
			(item) => item.reactionCode === reactionCode,
		);
		const active = !(current?.reactedByMe ?? false);

		try {
			const endpoint = await getBffApiUrl("SET_POST_REACTIONS");
			const requestBody = SetPostReactionsScheme.parse({
				postId,
				reactionCode,
				active,
			});

			const raw = await BffFetcher<unknown>(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const response = SetPostReactionsResponseSchema.parse(raw);

			setLocalPosts((prev) =>
				prev.map((item) =>
					item.id === response.postId
						? { ...item, reactions: response.reactions }
						: item,
				),
			);
		} catch (error) {
			console.error("Failed to set post reaction", error);
		}
	};

	return (
		<div className="radius-sm flex flex-col">
			{localPosts.map((post) => {
				return (
					<div
						key={post.id}
						id={`post-${post.id}`}
						className={`scroll-mt-24 px-4 py-1 md:py-3 min-h-14 flex items-center border bg-slate-50 ${
							highlightPostId === post.id ? "animate-post-highlight-once" : ""
						}`}
					>
						<div className="flex flex-col w-full">
							<div className="flex w-full items-center text-xs sm:text-sm whitespace-nowrap gap-2">
								<AuthorAvatar
									name={post.author.name}
									image={post.author.image}
									className="h-4 w-4 md:h-5 md:w-5"
									fallbackClassName="text-[8px]"
								/>
								<div className="flex gap-1 md:gap-2 flex-wrap text-xs text-gray-500">
									<span>{post.author.name}</span>
									<span>{getRelativeDate(post.createdAt)}</span>
								</div>
								<Emoji
									reactionCodes={reactionCodes}
									selectedReactionCodes={post.reactions
										.filter((reaction) => reaction.reactedByMe)
										.map((reaction) => reaction.reactionCode)}
									onReactAction={(emoji) => handleReaction(post.id, emoji)}
								/>
								<div className="ml-auto shrink-0">
									<DropDownMenu postId={post.id} />
								</div>
							</div>
							<span className="block mb-1 overflow-hidden text-xs md:text-sm line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words">
								{post.post}
							</span>
							<div className="flex flex-wrap items-center gap-2">
								{post.reactions.map(
									({ id, reactionCode, emoji, reactedByMe, count }) => {
										const isReacted = reactedByMe;
										return (
											<button
												type="button"
												key={`${post.id}:${reactionCode}:${id}`}
												className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-[0.3rem] md:px-[0.6rem] md:py-[0.1rem] text-sm font-bold transition-colors duration-150 animate-reaction-chip-pop ${
													isReacted
														? "bg-blue-300/20 hover:bg-blue-300/40 ring-1 ring-blue-400 text-blue-600"
														: "bg-slate-300/30 text-slate-600 hover:ring-1 hover:ring-blue-300 hover:bg-blue-400/10"
												}`}
												onClick={() => handleReaction(post.id, reactionCode)}
												aria-label={`${emoji} をリアクション`}
											>
												<span>{emoji}</span>
												<ReactionCount count={count} />
											</button>
										);
									},
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
