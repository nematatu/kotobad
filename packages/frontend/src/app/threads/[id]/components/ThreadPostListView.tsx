"use client";

import type { PostType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { AnimatePresence, motion } from "framer-motion";
import { Reply } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThreadPostImage } from "../../components/shared/ThreadPostImage";
import { CreatePostForm } from "./CreatePostForm";
import NoPost from "./fallback/NoPost";
import {
	getSelectedReactionCodes,
	messageLayoutTransition,
} from "./lib/postListViewHelpers";
import { PostReplyInlineForm } from "./PostReplyInlineForm";
import type { FlattenedPostItem } from "./types/flattenedPostItem";
import type { ReplyTarget } from "./types/replyTarget";
import { Emoji } from "./ui/emojiPicker";

type ThreadPostListViewProps = {
	threadId: number;
	visibleFlattenedPosts: FlattenedPostItem[];
	expandedReplyPostIdSet: Set<number>;
	replyEnterPostIdSet: Set<number>;
	realtimeEnterPostIdSet: Set<number>;
	highlightAnimatingPostId: number | null;
	replyTarget: ReplyTarget | null;
	reactionCodes: string[];
	disableEnterAnimation: boolean;
	enableLayoutAnimation: boolean;
	onToggleReplyTargetAction: (post: PostType) => void;
	onClearReplyTargetAction: () => void;
	onToggleRepliesAction: (postId: number) => void;
	onReactAction: (postId: number, reactionCode: string) => void;
};

type ConnectorSegment =
	| {
			type: "line";
			x1: number;
			y1: number;
			x2: number;
			y2: number;
	  }
	| {
			type: "path";
			d: string;
	  };

const collectPostDepthMaps = (visibleFlattenedPosts: FlattenedPostItem[]) => {
	const postById = new Map<number, PostType>();
	const depthByPostId = new Map<number, number>();
	for (const { post, depth } of visibleFlattenedPosts) {
		postById.set(post.id, post);
		depthByPostId.set(post.id, depth);
	}
	return { postById, depthByPostId };
};

const collectAncestorPosts = (
	post: PostType,
	postById: Map<number, PostType>,
	depthByPostId: Map<number, number>,
) => {
	const ancestorPosts: Array<{ id: number; depth: number }> = [];
	let parentPostId =
		typeof post.replyToPostId === "number" ? post.replyToPostId : null;
	while (typeof parentPostId === "number") {
		const ancestorDepth = depthByPostId.get(parentPostId);
		if (typeof ancestorDepth !== "number") break;
		ancestorPosts.push({ id: parentPostId, depth: ancestorDepth });
		const ancestorPost = postById.get(parentPostId);
		parentPostId =
			ancestorPost && typeof ancestorPost.replyToPostId === "number"
				? ancestorPost.replyToPostId
				: null;
	}
	return ancestorPosts;
};

const buildConnectorSegmentsByPostId = (
	visibleFlattenedPosts: FlattenedPostItem[],
	articleElementByPostId: Map<number, HTMLElement>,
	avatarAnchorByPostId: Map<number, HTMLElement>,
) => {
	const { postById, depthByPostId } = collectPostDepthMaps(
		visibleFlattenedPosts,
	);
	const nextConnectorSegmentsByPostId: Record<number, ConnectorSegment[]> = {};

	for (let index = 0; index < visibleFlattenedPosts.length; index += 1) {
		const currentItem = visibleFlattenedPosts[index];
		if (!currentItem) continue;

		const { post, depth } = currentItem;
		const articleElement = articleElementByPostId.get(post.id);
		const avatarAnchorElement = avatarAnchorByPostId.get(post.id);
		if (!articleElement || !avatarAnchorElement) continue;

		const articleRect = articleElement.getBoundingClientRect();
		const avatarRect = avatarAnchorElement.getBoundingClientRect();
		const avatarCenterX =
			avatarRect.left + avatarRect.width / 2 - articleRect.left;
		const avatarCenterY =
			avatarRect.top + avatarRect.height / 2 - articleRect.top;
		const articleHeight = articleRect.height;
		const nextDepth = visibleFlattenedPosts[index + 1]?.depth ?? -1;
		const hasVisibleChild = nextDepth > depth;

		const connectorSegments: ConnectorSegment[] = [];
		const ancestorPosts = collectAncestorPosts(post, postById, depthByPostId);

		for (const ancestorPost of ancestorPosts) {
			if (ancestorPost.depth >= depth - 1) continue;
			const ancestorAvatarElement = avatarAnchorByPostId.get(ancestorPost.id);
			if (!ancestorAvatarElement) continue;
			const ancestorAvatarRect = ancestorAvatarElement.getBoundingClientRect();
			const ancestorCenterX =
				ancestorAvatarRect.left +
				ancestorAvatarRect.width / 2 -
				articleRect.left;
			const shouldContinueAncestorConnector = nextDepth > ancestorPost.depth;
			connectorSegments.push({
				type: "line",
				x1: ancestorCenterX,
				y1: 0,
				x2: ancestorCenterX,
				y2: shouldContinueAncestorConnector ? articleHeight : avatarCenterY,
			});
		}

		const parentInfo = ancestorPosts.find((ancestorPost) => {
			return ancestorPost.depth === depth - 1;
		});
		if (parentInfo) {
			const parentAvatarElement = avatarAnchorByPostId.get(parentInfo.id);
			if (parentAvatarElement) {
				const parentAvatarRect = parentAvatarElement.getBoundingClientRect();
				const parentCenterX =
					parentAvatarRect.left + parentAvatarRect.width / 2 - articleRect.left;
				const elbowWidth = avatarCenterX - parentCenterX;
				const elbowRadius = Math.min(8, Math.max(0, elbowWidth));
				const elbowVerticalEnd = Math.max(0, avatarCenterY - elbowRadius);
				connectorSegments.push({
					type: "path",
					d: `M ${parentCenterX} 0 V ${elbowVerticalEnd} Q ${parentCenterX} ${avatarCenterY} ${
						parentCenterX + elbowRadius
					} ${avatarCenterY} H ${avatarCenterX}`,
				});

				if (nextDepth >= depth) {
					connectorSegments.push({
						type: "line",
						x1: parentCenterX,
						y1: avatarCenterY,
						x2: parentCenterX,
						y2: articleHeight,
					});
				}
			}
		}

		if (hasVisibleChild) {
			connectorSegments.push({
				type: "line",
				x1: avatarCenterX,
				y1: avatarCenterY,
				x2: avatarCenterX,
				y2: articleHeight,
			});
		}

		nextConnectorSegmentsByPostId[post.id] = connectorSegments;
	}

	return nextConnectorSegmentsByPostId;
};

const isSameConnectorSegment = (
	currentSegment: ConnectorSegment,
	nextSegment: ConnectorSegment,
) => {
	if (currentSegment.type === "path" && nextSegment.type === "path") {
		return currentSegment.d === nextSegment.d;
	}
	if (currentSegment.type !== "line" || nextSegment.type !== "line") {
		return false;
	}
	return (
		currentSegment.x1 === nextSegment.x1 &&
		currentSegment.y1 === nextSegment.y1 &&
		currentSegment.x2 === nextSegment.x2 &&
		currentSegment.y2 === nextSegment.y2
	);
};

const isSameConnectorSegmentMap = (
	currentConnectorSegmentsByPostId: Record<number, ConnectorSegment[]>,
	nextConnectorSegmentsByPostId: Record<number, ConnectorSegment[]>,
) => {
	const currentPostIds = Object.keys(currentConnectorSegmentsByPostId);
	const nextPostIds = Object.keys(nextConnectorSegmentsByPostId);
	if (currentPostIds.length !== nextPostIds.length) {
		return false;
	}

	for (const postIdKey of nextPostIds) {
		const postId = Number(postIdKey);
		const currentSegments = currentConnectorSegmentsByPostId[postId] ?? [];
		const nextSegments = nextConnectorSegmentsByPostId[postId] ?? [];
		if (currentSegments.length !== nextSegments.length) {
			return false;
		}

		for (let index = 0; index < nextSegments.length; index += 1) {
			const currentSegment = currentSegments[index];
			const nextSegment = nextSegments[index];
			if (!currentSegment || !nextSegment) {
				return false;
			}
			if (!isSameConnectorSegment(currentSegment, nextSegment)) {
				return false;
			}
		}
	}

	return true;
};

const renderConnectorSegment = (segment: ConnectorSegment, key: string) => {
	switch (segment.type) {
		case "line":
			return (
				<line
					key={key}
					x1={segment.x1}
					y1={segment.y1}
					x2={segment.x2}
					y2={segment.y2}
					className="stroke-slate-300 dark:stroke-slate-700"
					strokeWidth={1}
				/>
			);
		case "path":
			return (
				<path
					key={key}
					d={segment.d}
					className="fill-none stroke-slate-300 dark:stroke-slate-700"
					strokeWidth={1}
				/>
			);
	}
};

export const ThreadPostListView = ({
	threadId,
	visibleFlattenedPosts,
	expandedReplyPostIdSet,
	replyEnterPostIdSet,
	realtimeEnterPostIdSet,
	highlightAnimatingPostId,
	replyTarget,
	reactionCodes,
	disableEnterAnimation,
	enableLayoutAnimation,
	onToggleReplyTargetAction,
	onClearReplyTargetAction,
	onToggleRepliesAction,
	onReactAction,
}: ThreadPostListViewProps) => {
	const visiblePostCount = visibleFlattenedPosts.length;
	const articleElementByPostIdRef = useRef(new Map<number, HTMLElement>());
	const avatarAnchorByPostIdRef = useRef(new Map<number, HTMLElement>());
	const [connectorSegmentsByPostId, setConnectorSegmentsByPostId] = useState<
		Record<number, ConnectorSegment[]>
	>({});

	const setArticleElement = useCallback(
		(postId: number, element: HTMLElement | null) => {
			if (element) {
				articleElementByPostIdRef.current.set(postId, element);
				return;
			}
			articleElementByPostIdRef.current.delete(postId);
		},
		[],
	);

	const setAvatarAnchorElement = useCallback(
		(postId: number, element: HTMLElement | null) => {
			if (element) {
				avatarAnchorByPostIdRef.current.set(postId, element);
				return;
			}
			avatarAnchorByPostIdRef.current.delete(postId);
		},
		[],
	);

	const recalculateConnectorSegments = useCallback(() => {
		const nextConnectorSegmentsByPostId = buildConnectorSegmentsByPostId(
			visibleFlattenedPosts,
			articleElementByPostIdRef.current,
			avatarAnchorByPostIdRef.current,
		);
		setConnectorSegmentsByPostId((currentConnectorSegmentsByPostId) => {
			if (
				isSameConnectorSegmentMap(
					currentConnectorSegmentsByPostId,
					nextConnectorSegmentsByPostId,
				)
			) {
				return currentConnectorSegmentsByPostId;
			}
			return nextConnectorSegmentsByPostId;
		});
	}, [visibleFlattenedPosts]);

	useLayoutEffect(() => {
		let frameId = window.requestAnimationFrame(recalculateConnectorSegments);
		const handleResize = () => {
			window.cancelAnimationFrame(frameId);
			frameId = window.requestAnimationFrame(recalculateConnectorSegments);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.cancelAnimationFrame(frameId);
			window.removeEventListener("resize", handleResize);
		};
	}, [recalculateConnectorSegments]);

	return (
		<div className="space-y-3">
			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<div className="p-4">
					<CreatePostForm threadId={threadId} variant="default" />
				</div>
			</div>
			{visiblePostCount === 0 ? (
				<NoPost />
			) : (
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
					<AnimatePresence initial={false} mode="popLayout">
						{visibleFlattenedPosts.map(({ post, depth }, index) => {
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
							const relativeChatTime = getRelativeDate(post.createdAt);
							const threadDepthIndentPx =
								depth > 0 ? Math.min(depth, 8) * 22 : 0;
							const selectedReactionCodes = getSelectedReactionCodes(post);
							const connectorSegments =
								connectorSegmentsByPostId[post.id] ?? [];

							return (
								<motion.article
									key={post.id}
									id={`post-${post.id}`}
									layout={enableLayoutAnimation ? "position" : false}
									initial={shouldAnimateOnMount ? { opacity: 0, y: 8 } : false}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									transition={{
										duration: 0.24,
										ease: [0.22, 1, 0.36, 1],
										delay: shouldAnimateOnMount
											? Math.max(0, enterDelayMs) / 1000
											: 0,
										...(enableLayoutAnimation
											? { layout: messageLayoutTransition }
											: {}),
									}}
									className={cn(
										"relative px-3 py-3 sm:px-4",
										index > 0
											? "border-slate-300 border-t dark:border-slate-800"
											: undefined,
										depth > 0 ? "border-0" : undefined,
										isHighlighted
											? "bg-amber-50/70 dark:bg-amber-500/10"
											: undefined,
									)}
									style={
										threadDepthIndentPx > 0
											? { marginInlineStart: `${threadDepthIndentPx}px` }
											: undefined
									}
									ref={(element) => {
										setArticleElement(post.id, element);
									}}
								>
									{connectorSegments.length > 0 ? (
										<svg
											aria-hidden="true"
											className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
										>
											{connectorSegments.map((segment, segmentIndex) =>
												renderConnectorSegment(
													segment,
													`connector:${post.id}:${segmentIndex}`,
												),
											)}
										</svg>
									) : null}
									<div className="flex items-start">
										<div className="min-w-0 flex-1">
											<div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-600 dark:text-slate-50">
												<Link
													href={`/users/${encodeURIComponent(post.authorId)}`}
													showIndicator={false}
													className="inline-flex max-w-[220px] items-center gap-1.5"
												>
													<span
														ref={(element) => {
															setAvatarAnchorElement(post.id, element);
														}}
														className="relative inline-flex shrink-0"
													>
														<AuthorAvatar
															name={post.author.name}
															image={post.author.image}
															className={`${depth > 0 ? "h-5 w-5" : "h-7 w-7"} bg-white dark:bg-[#0f172a]`}
															fallbackClassName="text-[11px]"
														/>
													</span>
													<span>{post.author.name}</span>
												</Link>
												<span>#{post.localId}</span>
												<span>•</span>
												<span>{relativeChatTime}</span>
											</div>
											<div className="pl-9">
												<div className="space-y-2">
													<div className="whitespace-pre-wrap break-words text-[13px] text-slate-900 leading-relaxed dark:text-slate-100">
														<AutoLinkText
															text={post.post}
															linkClassName="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
														/>
													</div>
													{post.imageUrls.length > 0 && (
														<div
															className={
																post.imageUrls.length > 1
																	? "grid max-w-[18rem] grid-cols-2 gap-2"
																	: "max-w-[13rem]"
															}
														>
															{post.imageUrls.slice(0, 2).map((imageUrl) => (
																<ThreadPostImage
																	key={imageUrl}
																	imageUrl={imageUrl}
																	containerClassName="max-h-52 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
																/>
															))}
														</div>
													)}
												</div>
												{post.reactions.length > 0 ? (
													<div className="mt-2 flex flex-wrap items-center gap-1.5">
														{post.reactions.map(
															({
																id,
																reactionCode,
																emoji,
																reactedByMe,
																count,
															}) => (
																<button
																	type="button"
																	key={`${post.id}:${reactionCode}:${id}:thread`}
																	className={cn(
																		"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors",
																		reactedByMe
																			? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200"
																			: "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
																	)}
																	onClick={() =>
																		onReactAction(post.id, reactionCode)
																	}
																>
																	<span>{emoji}</span>
																	<span className="tabular-nums">{count}</span>
																</button>
															),
														)}
													</div>
												) : null}
												<div className="mt-1 flex flex-wrap items-center text-xs">
													<Button
														enableClickAnimation
														variant="ghost"
														size="sm"
														type="button"
														className="inline-flex items-center gap-1 rounded-full text-[10px] text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 [&_svg]:size-3.5"
														onClick={() => onToggleReplyTargetAction(post)}
													>
														<Reply aria-hidden="true" />
													</Button>
													{reactionCodes.length > 0 ? (
														<Emoji
															reactionCodes={reactionCodes}
															selectedReactionCodes={selectedReactionCodes}
															onReactAction={(reactionCode) =>
																onReactAction(post.id, reactionCode)
															}
														/>
													) : null}
													{post.replyCount > 0 && depth > 0 && (
														<Button
															enableClickAnimation
															variant="ghost"
															size="sm"
															type="button"
															className="text-[10px] rounded-full px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
															onClick={() => onToggleRepliesAction(post.id)}
														>
															{isRepliesExpanded
																? "返信を隠す"
																: `${post.replyCount}件の返信を表示`}
														</Button>
													)}
												</div>
											</div>
											<PostReplyInlineForm
												postId={post.id}
												threadId={threadId}
												replyTarget={replyTarget}
												isOpen={isReplyingToThisPost}
												keySuffix="thread"
												className="mt-2 overflow-hidden"
												onCloseAction={onClearReplyTargetAction}
											/>
										</div>
									</div>
								</motion.article>
							);
						})}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
};
