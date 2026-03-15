"use client";

import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { PostListType, PostType } from "@kotobad/shared/src/types/post";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Reply } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import IconButton from "@/components/common/button/IconButton";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { MessageReaction } from "./chat/MessageReaction";
import NoPost from "./NoPost";
import type { ReplyTarget } from "./types/replyTarget";
import { Emoji } from "./ui/emojiPicker";

type PostListProps = {
	posts: PostListType;
	threadId: number;
	highlightPostId: number | null;
	onPostedAction?: () => void;
};

type FlattenedPostItem = {
	post: PostType;
	depth: number;
};

const messageLayoutTransition = {
	duration: 0.24,
	ease: [0.22, 1, 0.36, 1] as const,
};

const chatDateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

const ONE_HOUR_SECONDS = 60 * 60;

const formatChatTime = (createdAt: string, nowMs: number): string => {
	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const diffSeconds = Math.floor((nowMs - date.getTime()) / 1000);
	if (diffSeconds >= 0 && diffSeconds < 60) {
		return `${diffSeconds}秒前`;
	}

	if (diffSeconds >= 60 && diffSeconds < ONE_HOUR_SECONDS) {
		return `${Math.floor(diffSeconds / 60)}分前`;
	}

	return chatDateTimeFormatter.format(date);
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
	const [openReactionPostId, setOpenReactionPostId] = useState<number | null>(
		null,
	);
	const [openMobileActionPostId, setOpenMobileActionPostId] = useState<
		number | null
	>(null);
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
		if (openReactionPostId === null) return;
		if (postLocalIdMap.has(openReactionPostId)) return;
		setOpenReactionPostId(null);
	}, [openReactionPostId, postLocalIdMap]);

	useEffect(() => {
		if (openMobileActionPostId === null) return;
		if (postLocalIdMap.has(openMobileActionPostId)) return;
		setOpenMobileActionPostId(null);
	}, [openMobileActionPostId, postLocalIdMap]);

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
	const nowMs = Date.now();

	return (
		<ChatPage
			header={null}
			messageList={
				<MessageList autoScrollKey={visiblePostCount} autoScrollEnabled={false}>
					{visiblePostCount === 0 ? (
						<NoPost />
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
								const isReactionPickerOpen =
									openReactionPostId === post.id ||
									openMobileActionPostId === post.id;
								const chatTime = formatChatTime(post.createdAt, nowMs);
								const selectedReactionCodes: string[] = [];
								for (const reaction of post.reactions) {
									if (!reaction.reactedByMe) continue;
									selectedReactionCodes.push(reaction.reactionCode);
								}
								const toggleReplyTarget = () => {
									setReplyTarget((current) =>
										current?.postId === post.id
											? null
											: {
													postId: post.id,
													localId: post.localId,
													authorName: post.author.name,
												},
									);
								};
								const hoverActionArea = (
									<div className="inline-flex items-center gap-1 rounded-full p-1">
										<div className="hidden items-center gap-1 sm:inline-flex">
											{reactionCodes.length > 0 ? (
												<Emoji
													reactionCodes={reactionCodes}
													selectedReactionCodes={selectedReactionCodes}
													onReactAction={(reactionCode) =>
														handleReaction(post.id, reactionCode)
													}
													onOpenChangeAction={(isOpen) => {
														setOpenReactionPostId((current) => {
															if (isOpen) return post.id;
															return current === post.id ? null : current;
														});
													}}
												/>
											) : null}
											<button
												type="button"
												className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 text-[#1e3a8a] transition-colors duration-150 hover:text-[#1d4f91] dark:text-[#dbeafe] dark:hover:text-[#bfdbfe]"
												aria-label="返信する"
												onClick={toggleReplyTarget}
											>
												<Reply className="h-4 w-4" aria-hidden="true" />
											</button>
										</div>
										<Popover
											open={openMobileActionPostId === post.id}
											onOpenChange={(open) => {
												setOpenMobileActionPostId(open ? post.id : null);
											}}
										>
											<PopoverTrigger asChild>
												<IconButton
													enableClickAnimation
													type="button"
													size="icon"
													variant="ghost"
													className="inline-flex h-8 w-8 rounded-full border-0 bg-transparent p-0 text-[#6b7280] hover:bg-transparent focus-visible:bg-transparent active:bg-transparent sm:hidden dark:text-[#94a3b8] dark:hover:bg-transparent dark:focus-visible:bg-transparent"
													aria-label="メッセージ操作メニュー"
													icon={<MoreHorizontal className="h-4 w-4" />}
												/>
											</PopoverTrigger>
											<PopoverContent
												align={isMine ? "end" : "start"}
												side="top"
												sideOffset={8}
												className="z-[130] w-[12.5rem] rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/95"
											>
												<div className="flex flex-col gap-1">
													{reactionCodes.length > 0 ? (
														<Emoji
															reactionCodes={reactionCodes}
															selectedReactionCodes={selectedReactionCodes}
															triggerLabel="リアクション"
															triggerClassName="inline-flex w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
															onReactAction={(reactionCode) => {
																handleReaction(post.id, reactionCode);
																setOpenMobileActionPostId(null);
															}}
														/>
													) : null}
													<button
														type="button"
														className="inline-flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
														onClick={() => {
															toggleReplyTarget();
															setOpenMobileActionPostId(null);
														}}
													>
														<Reply className="h-3.5 w-3.5" aria-hidden="true" />
														返信
													</button>
													<div className="mt-1 rounded-lg border-t border-slate-200 px-2 py-2 text-[11px] text-slate-700 dark:border-slate-700 dark:text-slate-200">
														<p>{chatTime || "-"}</p>
													</div>
												</div>
											</PopoverContent>
										</Popover>
									</div>
								);

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
											depth > 0 && !isMine ? "mb-3 pl-2 sm:pl-4" : "mb-3"
										}
									>
										{!isMine && (
											<Link
												href={`/users/${encodeURIComponent(post.authorId)}`}
												showIndicator={false}
												className="mb-3 inline-flex max-w-[196px] items-center gap-3 px-1"
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
										<div className={isMine ? undefined : "pl-6"}>
											<MessageBubble
												postId={post.id}
												isMine={isMine}
												isHighlighted={isHighlighted}
												enterDelayMs={enterDelayMs}
												animateOnMount={shouldAnimateOnMount}
												reactionPicker={hoverActionArea}
												isReactionPickerOpen={isReactionPickerOpen}
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
																	enableZoom
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
														? "mt-0.5 flex flex-wrap items-center justify-end gap-2 pr-1"
														: "mt-0.5 flex flex-wrap items-center gap-2 pl-1"
												}
											>
												<MessageReaction
													postId={post.id}
													reactions={post.reactions}
													isMine={isMine}
													onReactAction={(reactionCode) =>
														handleReaction(post.id, reactionCode)
													}
												/>
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
										</div>
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
