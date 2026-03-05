"use client";

import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { PostListType, PostType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { PostDropDownMenu } from "@/components/feature/dropDownMenu/PostDropDownMenu";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { CreatePostForm } from "./CreatePostForm";
import type { ReplyTarget } from "./types/replyTarget";
import { Emoji } from "./ui/emojiPicker";
import { PostReplyButton } from "./ui/PostReplyButton";

type PostListProps = {
	posts: PostListType;
	threadId: number;
	highlightPostId: number | null;
	onPostedAction?: () => void;
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
	threadId,
	highlightPostId,
	onPostedAction,
}: PostListProps) => {
	const [localPosts, setLocalPosts] = useState<PostListType>(posts);
	const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
	const [expandedReplyPostIds, setExpandedReplyPostIds] = useState<number[]>(
		[],
	);
	const [replyEnterPostIds, setReplyEnterPostIds] = useState<number[]>([]);
	const previousVisiblePostIdsRef = useRef<number[] | null>(null);
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
	const postByIdMap = useMemo(() => {
		return new Map(localPosts.map((post) => [post.id, post]));
	}, [localPosts]);
	const postLocalIdMap = useMemo(() => {
		return new Map(localPosts.map((post) => [post.id, post.localId]));
	}, [localPosts]);
	const expandedReplyPostIdSet = useMemo(() => {
		return new Set(expandedReplyPostIds);
	}, [expandedReplyPostIds]);
	const flattenedPosts = useMemo(() => {
		const tree = buildReplyTree(localPosts);
		return flattenReplyTree(tree);
	}, [localPosts]);
	const postDepthById = useMemo(() => {
		return new Map(flattenedPosts.map(({ post, depth }) => [post.id, depth]));
	}, [flattenedPosts]);
	const visibleFlattenedPosts = useMemo(() => {
		return flattenedPosts.filter(({ post, depth }) => {
			if (depth <= 1) {
				return true;
			}

			let parentId = post.replyToPostId;
			while (typeof parentId === "number") {
				const parentDepth = postDepthById.get(parentId);
				if (typeof parentDepth !== "number") {
					return false;
				}
				if (parentDepth > 0 && !expandedReplyPostIdSet.has(parentId)) {
					return false;
				}
				const parentPost = postByIdMap.get(parentId);
				if (!parentPost) {
					return false;
				}
				parentId = parentPost.replyToPostId ?? null;
			}
			return true;
		});
	}, [flattenedPosts, postDepthById, expandedReplyPostIdSet, postByIdMap]);
	const replyEnterPostIdSet = useMemo(() => {
		return new Set(replyEnterPostIds);
	}, [replyEnterPostIds]);

	useEffect(() => {
		setLocalPosts(posts);
	}, [posts]);

	useEffect(() => {
		if (!replyTarget) return;
		if (postLocalIdMap.has(replyTarget.postId)) return;
		setReplyTarget(null);
	}, [postLocalIdMap, replyTarget]);

	useEffect(() => {
		const currentVisiblePostIds = visibleFlattenedPosts.map(
			({ post }) => post.id,
		);
		const previousVisiblePostIds = previousVisiblePostIdsRef.current;
		previousVisiblePostIdsRef.current = currentVisiblePostIds;

		if (!previousVisiblePostIds) {
			return;
		}

		const previousVisiblePostIdSet = new Set(previousVisiblePostIds);
		const enteringReplyPostIds = visibleFlattenedPosts
			.filter(
				({ post, depth }) =>
					depth > 0 && !previousVisiblePostIdSet.has(post.id),
			)
			.map(({ post }) => post.id);

		if (enteringReplyPostIds.length === 0) {
			return;
		}

		setReplyEnterPostIds(enteringReplyPostIds);
		const enteringReplyPostIdSet = new Set(enteringReplyPostIds);
		const timeoutId = window.setTimeout(() => {
			setReplyEnterPostIds((prev) =>
				prev.filter((id) => !enteringReplyPostIdSet.has(id)),
			);
		}, 420);

		return () => window.clearTimeout(timeoutId);
	}, [visibleFlattenedPosts]);

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

	const toggleReplies = (postId: number) => {
		setExpandedReplyPostIds((prev) =>
			prev.includes(postId)
				? prev.filter((id) => id !== postId)
				: [...prev, postId],
		);
	};

	return (
		<div className="rounded-lg bg-white sm:p-2 sm:pb-4 flex flex-col">
			{visibleFlattenedPosts.map(({ post, depth }) => {
				const indent = Math.min(depth * 25, 84);
				const isReplyingToThisPost = replyTarget?.postId === post.id;
				const isRepliesExpanded = expandedReplyPostIdSet.has(post.id);
				const isReplyEnterAnimating = replyEnterPostIdSet.has(post.id);
				const replyEnterDelayMs = isReplyEnterAnimating
					? Math.min(depth * 28, 140)
					: 0;

				return (
					<div
						key={post.id}
						id={`post-${post.id}`}
						className={`scroll-mt-24 px-4 py-2 md:py-3 min-h-14 flex items-center border-b-[0.7px] border-slate-400  ${isRepliesExpanded ? "border-dashed border-b-2" : ""} ${isReplyEnterAnimating ? "animate-reply-expand-down" : ""}`}
						style={{
							paddingLeft: `${16 + indent}px`,
							animationDelay: isReplyEnterAnimating
								? `${replyEnterDelayMs}ms`
								: undefined,
						}}
					>
						<div className="flex flex-col w-full">
							<div className="flex w-full items-center sm:text-sm whitespace-nowrap gap-2">
								<Link
									href={`/users/${encodeURIComponent(post.authorId)}`}
									className="inline-flex items-center gap-2"
								>
									<AuthorAvatar
										name={post.author.name}
										image={post.author.image}
										className="h-4 w-4 md:h-7 md:w-7"
										fallbackClassName="text-[8px]"
									/>
									<span className="text-xs sm:text-md text-gray-500 hover:text-blue-700 transition-colors">
										{post.author.name}
									</span>
								</Link>
								<div className="flex gap-1 md:gap-2 flex-wrap text-xs text-gray-500">
									<span>{getRelativeDate(post.createdAt)}</span>
								</div>
								<Emoji
									reactionCodes={reactionCodes}
									selectedReactionCodes={post.reactions
										.filter((reaction) => reaction.reactedByMe)
										.map((reaction) => reaction.reactionCode)}
									onReactAction={(emoji) => handleReaction(post.id, emoji)}
								/>
								<PostReplyButton
									handleClick={() =>
										setReplyTarget((current) =>
											current?.postId === post.id
												? null
												: {
														postId: post.id,
														localId: post.localId,
														authorName: post.author.name,
													},
										)
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
							{post.replyCount > 0 && depth > 0 && (
								<div className="items-start mt-2">
									<button
										type="button"
										className="text-xs text-blue-600 hover:underline cursor-pointer"
										onClick={() => toggleReplies(post.id)}
									>
										{isRepliesExpanded
											? "返信を隠す"
											: `${post.replyCount}件の返信を表示`}
									</button>
								</div>
							)}
							{isReplyingToThisPost && (
								<div className="mt-3">
									<CreatePostForm
										threadId={threadId}
										replyTarget={replyTarget}
										variant="inline"
										onPostedAction={() => {
											setReplyTarget(null);
											onPostedAction?.();
										}}
										onClearReplyTargetAction={() => setReplyTarget(null)}
									/>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
