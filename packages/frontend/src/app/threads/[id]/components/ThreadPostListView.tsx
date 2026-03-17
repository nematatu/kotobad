"use client";

import type { PostType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { AnimatePresence, motion } from "framer-motion";
import { Reply } from "lucide-react";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThreadPostImage } from "../../components/shared/ThreadPostImage";
import { CreatePostForm } from "./CreatePostForm";
import {
	getSelectedReactionCodes,
	messageLayoutTransition,
} from "./lib/postListViewHelpers";
import NoPost from "./NoPost";
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
								>
									<div className="flex items-start">
										<div className="min-w-0 flex-1">
											<div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-600 dark:text-slate-50">
												<Link
													href={`/users/${encodeURIComponent(post.authorId)}`}
													showIndicator={false}
													className="inline-flex max-w-[220px] items-center gap-1.5"
												>
													<AuthorAvatar
														name={post.author.name}
														image={post.author.image}
														className={`${depth > 0 ? "h-5 w-5" : "h-7 w-7"} bg-white dark:bg-[#0f172a]`}
														fallbackClassName="text-[11px]"
													/>
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
																	enableZoom
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
