"use client";

import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { PostListType, PostType } from "@kotobad/shared/src/types/post";
import { AnimatePresence, motion } from "framer-motion";
import { Reply } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { ThreadPostImage } from "../../components/shared/ThreadPostImage";
import { CreatePostForm } from "./CreatePostForm";
import { ChatPage } from "./chat/ChatPage";
import { MessageBubble } from "./chat/MessageBubble";
import { MessageInput } from "./chat/MessageInput";
import { MessageList } from "./chat/MessageList";
import type { ReplyTarget } from "./types/replyTarget";
import { Emoji } from "./ui/emojiPicker";

type PostListProps = {
	posts: PostListType;
	threadId: number;
	highlightPostId: number | null;
	onPostedAction?: () => void;
};

type ReactionCountProps = {
	count: number;
};

type FlattenedPostItem = {
	post: PostType;
	depth: number;
};

const messageLayoutTransition = {
	duration: 0.24,
	ease: [0.22, 1, 0.36, 1] as const,
};

const chatTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

const formatChatTime = (createdAt: string): string => {
	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return chatTimeFormatter.format(date);
};

const LARGE_LIST_DISABLE_ENTER_ANIMATION = 80;
const LARGE_LIST_DISABLE_LAYOUT_ANIMATION = 120;

const getVisibleFlattenedPosts = (
	posts: PostListType,
	expandedReplyPostIdSet: Set<number>,
): FlattenedPostItem[] => {
	if (posts.length === 0) {
		return [];
	}

	const nodeMap = new Map<number, PostType>();
	for (const post of posts) {
		nodeMap.set(post.id, post);
	}

	const childrenByParentId = new Map<number, PostType[]>();
	const roots: PostType[] = [];
	for (const post of posts) {
		const parentId = post.replyToPostId;
		if (typeof parentId === "number" && nodeMap.has(parentId)) {
			const siblings = childrenByParentId.get(parentId);
			if (siblings) {
				siblings.push(post);
			} else {
				childrenByParentId.set(parentId, [post]);
			}
			continue;
		}
		roots.push(post);
	}

	const visibleFlattened: FlattenedPostItem[] = [];
	const stack: Array<{
		post: PostType;
		depth: number;
		ancestorsExpanded: boolean;
	}> = [];

	for (let index = roots.length - 1; index >= 0; index -= 1) {
		const root = roots[index];
		if (!root) continue;
		stack.push({
			post: root,
			depth: 0,
			ancestorsExpanded: true,
		});
	}

	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) continue;

		const isVisible =
			current.depth <= 1 || (current.depth > 1 && current.ancestorsExpanded);
		if (isVisible) {
			visibleFlattened.push({
				post: current.post,
				depth: current.depth,
			});
		}

		const children = childrenByParentId.get(current.post.id);
		if (!children || children.length === 0) {
			continue;
		}

		const canRevealDeeperReplies =
			current.depth === 0
				? true
				: current.ancestorsExpanded &&
					expandedReplyPostIdSet.has(current.post.id);

		if (!canRevealDeeperReplies && current.depth >= 1) {
			continue;
		}

		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (!child) continue;
			stack.push({
				post: child,
				depth: current.depth + 1,
				ancestorsExpanded: canRevealDeeperReplies,
			});
		}
	}

	return visibleFlattened;
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
	const [realtimeEnterPostIds, setRealtimeEnterPostIds] = useState<number[]>(
		[],
	);
	const [highlightAnimatingPostId, setHighlightAnimatingPostId] = useState<
		number | null
	>(null);
	const previousVisiblePostIdsRef = useRef<number[] | null>(null);
	const previousPostIdsRef = useRef<number[] | null>(null);
	const previousHighlightPostIdRef = useRef<number | null>(null);
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
	const expandedReplyPostIdSet = useMemo(() => {
		return new Set(expandedReplyPostIds);
	}, [expandedReplyPostIds]);
	const visibleFlattenedPosts = useMemo(() => {
		return getVisibleFlattenedPosts(localPosts, expandedReplyPostIdSet);
	}, [localPosts, expandedReplyPostIdSet]);
	const replyEnterPostIdSet = useMemo(() => {
		return new Set(replyEnterPostIds);
	}, [replyEnterPostIds]);
	const realtimeEnterPostIdSet = useMemo(() => {
		return new Set(realtimeEnterPostIds);
	}, [realtimeEnterPostIds]);

	useEffect(() => {
		const nextPostIds = posts.map((post) => post.id);
		const previousPostIds = previousPostIdsRef.current;
		previousPostIdsRef.current = nextPostIds;
		setLocalPosts(posts);

		if (!previousPostIds) {
			return;
		}

		const previousPostIdSet = new Set(previousPostIds);
		const enteringPostIds = nextPostIds.filter(
			(id) => !previousPostIdSet.has(id),
		);
		if (enteringPostIds.length === 0) {
			return;
		}

		setRealtimeEnterPostIds((prev) => {
			const merged = new Set(prev);
			for (const id of enteringPostIds) {
				merged.add(id);
			}
			return [...merged];
		});

		const enteringPostIdSet = new Set(enteringPostIds);
		const timeoutId = window.setTimeout(() => {
			setRealtimeEnterPostIds((prev) =>
				prev.filter((id) => !enteringPostIdSet.has(id)),
			);
		}, 460);

		return () => window.clearTimeout(timeoutId);
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

	/* biome-ignore lint/correctness/useExhaustiveDependencies: highlighted post may appear after the initial render, so visibleFlattenedPosts is intentionally included to retry DOM lookup. */
	useEffect(() => {
		if (!highlightPostId) return;
		const targetElement = document.getElementById(
			`post-${highlightPostId}`,
		) as HTMLElement | null;
		if (!targetElement) return;

		if (previousHighlightPostIdRef.current === highlightPostId) {
			return;
		}

		previousHighlightPostIdRef.current = highlightPostId;

		targetElement.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "nearest",
		});
		setHighlightAnimatingPostId(highlightPostId);
	}, [highlightPostId, visibleFlattenedPosts]);

	useEffect(() => {
		if (!highlightAnimatingPostId) return;

		const timeoutId = window.setTimeout(() => {
			setHighlightAnimatingPostId((current) =>
				current === highlightAnimatingPostId ? null : current,
			);
		}, 2200);

		return () => window.clearTimeout(timeoutId);
	}, [highlightAnimatingPostId]);

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
	const visiblePostCount = visibleFlattenedPosts.length;
	const disableEnterAnimation =
		visiblePostCount > LARGE_LIST_DISABLE_ENTER_ANIMATION;
	const enableLayoutAnimation =
		visiblePostCount <= LARGE_LIST_DISABLE_LAYOUT_ANIMATION;

	return (
		<ChatPage
			header={null}
			messageList={
				<MessageList autoScrollKey={visiblePostCount} autoScrollEnabled={false}>
					{visiblePostCount === 0 ? (
						<div className="flex h-full min-h-52 items-center justify-center">
							<p className="rounded-full bg-[#f3f4f6] px-4 py-2 text-[#4b5563] text-sm font-medium">
								まだメッセージはありません。最初の投稿をしてみましょう。
							</p>
						</div>
					) : (
						<AnimatePresence initial={false} mode="popLayout">
							{visibleFlattenedPosts.map(({ post, depth }) => {
								const isReplyingToThisPost = replyTarget?.postId === post.id;
								const isRepliesExpanded = expandedReplyPostIdSet.has(post.id);
								const isReplyEnterAnimating = replyEnterPostIdSet.has(post.id);
								const isRealtimeEnterAnimating = realtimeEnterPostIdSet.has(
									post.id,
								);
								const shouldAnimateOnMount =
									!disableEnterAnimation ||
									isReplyEnterAnimating ||
									isRealtimeEnterAnimating;
								const enterDelayMs = shouldAnimateOnMount
									? isReplyEnterAnimating
										? Math.min(depth * 28, 140)
										: isRealtimeEnterAnimating
											? 30
											: 0
									: 0;
								const isHighlighted = highlightAnimatingPostId === post.id;
								const isMine = post.isMine;
								const chatTime = formatChatTime(post.createdAt);
								const selectedReactionCodes: string[] = [];
								for (const reaction of post.reactions) {
									if (!reaction.reactedByMe) continue;
									selectedReactionCodes.push(reaction.reactionCode);
								}

								return (
									<motion.div
										key={post.id}
										layout={enableLayoutAnimation ? "position" : false}
										transition={
											enableLayoutAnimation
												? { layout: messageLayoutTransition }
												: undefined
										}
										className={
											depth > 0 && !isMine ? "pl-2 sm:pl-4" : undefined
										}
									>
										{!isMine && (
											<Link
												href={`/users/${encodeURIComponent(post.authorId)}`}
												showIndicator={false}
												className="mb-1 inline-flex max-w-[196px] items-center gap-1.5 px-1"
											>
												<AuthorAvatar
													name={post.author.name}
													image={post.author.image}
													className="h-5 w-5 bg-white dark:bg-[#0f172a]"
													fallbackClassName="text-[10px]"
												/>
												<span className="truncate text-[#4b5563] text-[11px] font-medium dark:text-[#cbd5e1]">
													{post.author.name}
												</span>
											</Link>
										)}
										<MessageBubble
											postId={post.id}
											isMine={isMine}
											isHighlighted={isHighlighted}
											enterDelayMs={enterDelayMs}
											animateOnMount={shouldAnimateOnMount}
											timeLabel={chatTime}
										>
											<div className="space-y-2">
												<div
													className={
														isMine
															? "whitespace-pre-wrap break-words text-[#0f172a] text-sm leading-relaxed dark:text-[#e2ecff]"
															: "whitespace-pre-wrap break-words text-[#111827] text-sm leading-relaxed dark:text-[#e5e7eb]"
													}
												>
													<AutoLinkText
														text={post.post}
														linkClassName={
															isMine
																? "text-[#1d4f91] hover:text-[#123b70] underline-blue-400/50 dark:text-[#bfdbfe] dark:hover:text-[#dbeafe]"
																: "text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
														}
													/>
												</div>

												{post.imageUrls.length > 0 && (
													<div
														className={
															post.imageUrls.length > 1
																? "grid max-w-sm grid-cols-2 gap-2"
																: "max-w-[16rem]"
														}
													>
														{post.imageUrls.slice(0, 2).map((imageUrl) => (
															<ThreadPostImage
																key={imageUrl}
																imageUrl={imageUrl}
																width={1280}
																quality={82}
																containerClassName="h-36"
																imageClassName="h-full"
															/>
														))}
													</div>
												)}
											</div>
										</MessageBubble>
										<div
											className={
												isMine
													? "mt-1 flex flex-wrap items-center justify-end gap-2 pr-1"
													: "mt-1 flex flex-wrap items-center gap-2 pl-1"
											}
										>
											<button
												type="button"
												className={
													isMine
														? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 text-[#1e3a8a] transition-colors duration-150 hover:bg-[#dbeafe] hover:text-[#1d4f91] dark:text-[#dbeafe] dark:hover:bg-[#31507a]"
														: "inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 text-[#4b5563] transition-colors duration-150 hover:bg-[#e5e7eb] hover:text-[#111827] dark:text-[#cbd5e1] dark:hover:bg-[#334155]"
												}
												aria-label="返信する"
												onClick={() =>
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
											>
												<Reply className="h-3.5 w-3.5" aria-hidden="true" />
											</button>
											{reactionCodes.length > 0 ? (
												<Emoji
													reactionCodes={reactionCodes}
													selectedReactionCodes={selectedReactionCodes}
													onReactAction={(reactionCode) =>
														handleReaction(post.id, reactionCode)
													}
												/>
											) : null}
											{post.replyCount > 0 && depth > 0 && (
												<button
													type="button"
													className={
														isMine
															? "cursor-pointer text-[#1e3a8a] text-[11px] underline-offset-2 hover:underline dark:text-[#dbeafe]"
															: "cursor-pointer text-[#4b5563] text-[11px] underline-offset-2 hover:underline dark:text-[#cbd5e1]"
													}
													onClick={() => toggleReplies(post.id)}
												>
													{isRepliesExpanded
														? "返信を隠す"
														: `${post.replyCount}件の返信を表示`}
												</button>
											)}
										</div>
										<AnimatePresence initial={false}>
											{post.reactions.length > 0 ? (
												<motion.div
													key={`${post.id}:reactions`}
													layout
													initial={{ opacity: 0, height: 0, y: -4 }}
													animate={{ opacity: 1, height: "auto", y: 0 }}
													exit={{ opacity: 0, height: 0, y: -4 }}
													transition={{
														duration: 0.2,
														ease: [0.22, 1, 0.36, 1],
													}}
													className={
														isMine
															? "mt-1 flex flex-wrap items-center justify-end gap-2 overflow-hidden pr-1"
															: "mt-1 flex flex-wrap items-center gap-2 overflow-hidden pl-1"
													}
												>
													{post.reactions.map(
														({
															id,
															reactionCode,
															emoji,
															reactedByMe,
															count,
														}) => {
															const isReacted = reactedByMe;
															return (
																<button
																	type="button"
																	key={`${post.id}:${reactionCode}:${id}`}
																	className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-150 ${
																		isReacted
																			? isMine
																				? "bg-[#dbeafe] text-[#1e3a8a] ring-1 ring-[#93c5fd] dark:bg-[#31507a] dark:text-[#dbeafe] dark:ring-[#4d77b2]"
																				: "bg-[#06C755]/15 text-[#111827] ring-1 ring-[#06C755]/40 dark:bg-[#06C755]/25 dark:text-[#e5e7eb]"
																			: isMine
																				? "bg-[#eff6ff] text-[#1e3a8a] hover:bg-[#dbeafe] dark:bg-[#2a3b52] dark:text-[#dbeafe] dark:hover:bg-[#334a67]"
																				: "bg-[#e5e7eb] text-[#374151] hover:bg-[#d1d5db] dark:bg-[#334155] dark:text-[#cbd5e1] dark:hover:bg-[#475569]"
																	}`}
																	onClick={() =>
																		handleReaction(post.id, reactionCode)
																	}
																	aria-label={`${emoji} をリアクション`}
																>
																	<span>{emoji}</span>
																	<ReactionCount count={count} />
																</button>
															);
														},
													)}
												</motion.div>
											) : null}
										</AnimatePresence>

										<AnimatePresence initial={false}>
											{isReplyingToThisPost ? (
												<motion.div
													key={`${post.id}:reply-form`}
													layout
													initial={{ opacity: 0, height: 0, y: -4 }}
													animate={{ opacity: 1, height: "auto", y: 0 }}
													exit={{ opacity: 0, height: 0, y: -4 }}
													transition={{
														duration: 0.22,
														ease: [0.22, 1, 0.36, 1],
													}}
													className="mt-1 overflow-hidden pt-1"
												>
													<CreatePostForm
														threadId={threadId}
														replyTarget={replyTarget}
														variant="inline"
														onPostedAction={() => {
															setReplyTarget(null);
															onPostedAction?.();
														}}
														onClearReplyTargetAction={() =>
															setReplyTarget(null)
														}
													/>
												</motion.div>
											) : null}
										</AnimatePresence>
									</motion.div>
								);
							})}
						</AnimatePresence>
					)}
				</MessageList>
			}
			messageInput={
				<MessageInput>
					<CreatePostForm
						threadId={threadId}
						variant="chat"
						onPostedAction={onPostedAction}
					/>
				</MessageInput>
			}
		/>
	);
};
