"use client";

import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { PostListType, PostType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { PostDropDownMenu } from "@/components/feature/dropDownMenu/PostDropDownMenu";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import type { ReplyTarget } from "./types/replyTarget";
import { Emoji } from "./ui/emojiPicker";
import { PostReply } from "./ui/PostReply";

type PostListProps = {
	posts: PostListType;
	highlightPostId: number | null;
	onReplyAction: (target: ReplyTarget) => void;
};

type ReactionCountProps = {
	count: number;
};

type ReplyTreeNode = {
	post: PostType;
	children: ReplyTreeNode[];
};

const buildReplyTree = (posts: PostListType): ReplyTreeNode[] => {
	const nodeMap = new Map<number, ReplyTreeNode>();
	for (const post of posts) {
		nodeMap.set(post.id, {
			post,
			children: [],
		});
	}

	const roots: ReplyTreeNode[] = [];
	for (const post of posts) {
		const node = nodeMap.get(post.id);
		if (!node) continue;

		const parentId = post.replyToPostId;
		if (parentId && nodeMap.has(parentId)) {
			nodeMap.get(parentId)?.children.push(node);
			continue;
		}
		roots.push(node);
	}

	return roots;
};

const flattenReplyTree = (
	nodes: ReplyTreeNode[],
	depth = 0,
): Array<{ post: PostType; depth: number }> => {
	const flattened: Array<{ post: PostType; depth: number }> = [];
	for (const node of nodes) {
		flattened.push({
			post: node.post,
			depth,
		});
		flattened.push(...flattenReplyTree(node.children, depth + 1));
	}
	return flattened;
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

export const PostList = ({
	posts,
	highlightPostId,
	onReplyAction,
}: PostListProps) => {
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
	const postLocalIdMap = useMemo(() => {
		return new Map(localPosts.map((post) => [post.id, post.localId]));
	}, [localPosts]);
	const flattenedPosts = useMemo(() => {
		const tree = buildReplyTree(localPosts);
		return flattenReplyTree(tree);
	}, [localPosts]);

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
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				return;
			}
			console.error("Failed to set post reaction", error);
		}
	};

	return (
		<div className="radius-sm flex flex-col">
			{flattenedPosts.map(({ post, depth }) => {
				const parentLocalId =
					post.replyToPostId === null || post.replyToPostId === undefined
						? null
						: (postLocalIdMap.get(post.replyToPostId) ?? null);
				const indent = Math.min(depth * 14, 84);

				return (
					<div
						key={post.id}
						id={`post-${post.id}`}
						className={`scroll-mt-24 px-4 py-2 md:py-3 min-h-14 flex items-center border bg-slate-50 ${
							highlightPostId === post.id ? "animate-post-highlight-once" : ""
						}`}
						style={{ paddingLeft: `${16 + indent}px` }}
					>
						<div className="flex flex-col w-full">
							<div className="flex w-full items-center sm:text-sm whitespace-nowrap gap-2">
								<AuthorAvatar
									name={post.author.name}
									image={post.author.image}
									className="h-4 w-4 md:h-5 md:w-5"
									fallbackClassName="text-[8px]"
								/>
								<div className="flex gap-1 md:gap-2 flex-wrap text-xs text-gray-500">
									<span>{post.author.name}</span>
									<span>{getRelativeDate(post.createdAt)}</span>
									{parentLocalId !== null && (
										<span>返信元: #{parentLocalId}</span>
									)}
								</div>
								<Emoji
									reactionCodes={reactionCodes}
									selectedReactionCodes={post.reactions
										.filter((reaction) => reaction.reactedByMe)
										.map((reaction) => reaction.reactionCode)}
									onReactAction={(emoji) => handleReaction(post.id, emoji)}
								/>
								<PostReply
									handleClick={() =>
										onReplyAction({
											postId: post.id,
											localId: post.localId,
											authorName: post.author.name,
										})
									}
								/>
								<div className="ml-auto shrink-0">
									<PostDropDownMenu postId={post.id} />
								</div>
							</div>
							<span className="block overflow-hidden text-sm line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words">
								{post.post}
							</span>
							{post.reactions.length > 0 && (
								<div className="flex mt-2 flex-wrap items-center gap-2">
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
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
