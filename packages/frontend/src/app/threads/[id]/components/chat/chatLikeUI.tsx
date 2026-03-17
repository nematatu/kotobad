"use client";

import type { PostType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Reply } from "lucide-react";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import IconButton from "@/components/common/button/IconButton";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Card } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ThreadPostImage } from "../../../components/shared/ThreadPostImage";
import { CreatePostForm } from "../CreatePostForm";
import NoPost from "../fallback/NoPost";
import {
	formatChatTime,
	getSelectedReactionCodes,
	messageLayoutTransition,
} from "../lib/postListViewHelpers";
import { PostReplyInlineForm } from "../PostReplyInlineForm";
import type { FlattenedPostItem } from "../types/flattenedPostItem";
import type { ReplyTarget } from "../types/replyTarget";
import { Emoji } from "../ui/emojiPicker";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { MessageReaction } from "./MessageReaction";

type ChatLikeUIProps = {
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
	openReactionPostId: number | null;
	openMobileActionPostId: number | null;
	onToggleReplyTargetAction: (post: PostType) => void;
	onClearReplyTargetAction: () => void;
	onToggleRepliesAction: (postId: number) => void;
	onReactAction: (postId: number, reactionCode: string) => void;
	onReactionPickerOpenChangeAction: (postId: number, isOpen: boolean) => void;
	onMobileActionOpenChangeAction: (postId: number, isOpen: boolean) => void;
};

export const ChatLikeUI = ({
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
	openReactionPostId,
	openMobileActionPostId,
	onToggleReplyTargetAction,
	onClearReplyTargetAction,
	onToggleRepliesAction,
	onReactAction,
	onReactionPickerOpenChangeAction,
	onMobileActionOpenChangeAction,
}: ChatLikeUIProps) => {
	const nowMs = Date.now();
	const visiblePostCount = visibleFlattenedPosts.length;

	return (
		<Card className="overflow-hidden border-0 bg-[#f8fbff] shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-[#0b1220]">
			<div className="flex flex-col">
				<div>
					<MessageList
						autoScrollKey={visiblePostCount}
						autoScrollEnabled={false}
					>
						{visiblePostCount === 0 ? (
							<NoPost />
						) : (
							<AnimatePresence initial={false} mode="popLayout">
								{visibleFlattenedPosts.map(({ post, depth }) => {
									const isReplyingToThisPost = replyTarget?.postId === post.id;
									const isRepliesExpanded = expandedReplyPostIdSet.has(post.id);
									const isReplyEnterAnimating = replyEnterPostIdSet.has(
										post.id,
									);
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
									const relativeChatTime = getRelativeDate(post.createdAt);
									const selectedReactionCodes = getSelectedReactionCodes(post);

									const hoverActionArea = (
										<div className="inline-flex items-center gap-1 rounded-full p-1">
											<div className="hidden items-center gap-1 sm:inline-flex">
												{reactionCodes.length > 0 ? (
													<Emoji
														reactionCodes={reactionCodes}
														selectedReactionCodes={selectedReactionCodes}
														onReactAction={(reactionCode) =>
															onReactAction(post.id, reactionCode)
														}
														onOpenChangeAction={(isOpen) => {
															onReactionPickerOpenChangeAction(post.id, isOpen);
														}}
													/>
												) : null}
												<button
													type="button"
													className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 text-[#1e3a8a] transition-colors duration-150 hover:text-[#1d4f91] dark:text-[#dbeafe] dark:hover:text-[#bfdbfe]"
													aria-label="返信する"
													onClick={() => onToggleReplyTargetAction(post)}
												>
													<Reply className="h-4 w-4" aria-hidden="true" />
												</button>
											</div>
											<Popover
												open={openMobileActionPostId === post.id}
												onOpenChange={(open) => {
													onMobileActionOpenChangeAction(post.id, open);
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
																	onReactAction(post.id, reactionCode);
																	onMobileActionOpenChangeAction(
																		post.id,
																		false,
																	);
																}}
															/>
														) : null}
														<button
															type="button"
															className="inline-flex items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
															onClick={() => {
																onToggleReplyTargetAction(post);
																onMobileActionOpenChangeAction(post.id, false);
															}}
														>
															<Reply
																className="h-3.5 w-3.5"
																aria-hidden="true"
															/>
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
																		containerClassName="h-36"
																		imageClassName="h-full"
																	/>
																))}
															</div>
														)}
														<p
															className={
																isMine
																	? "pt-0.5 text-right text-[10px] leading-none tabular-nums text-[#1e3a8a] dark:text-[#bfdbfe]"
																	: "pt-0.5 text-left text-[10px] leading-none tabular-nums text-[#6b7280] dark:text-[#94a3b8]"
															}
														>
															{relativeChatTime}
														</p>
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
															onReactAction(post.id, reactionCode)
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
															onClick={() => onToggleRepliesAction(post.id)}
														>
															{isRepliesExpanded
																? "返信を隠す"
																: `${post.replyCount}件の返信を表示`}
														</button>
													)}
												</div>
												<PostReplyInlineForm
													postId={post.id}
													threadId={threadId}
													replyTarget={replyTarget}
													isOpen={isReplyingToThisPost}
													keySuffix="chat"
													className="mt-1 overflow-hidden pt-1"
													onCloseAction={onClearReplyTargetAction}
												/>
											</div>
										</motion.div>
									);
								})}
							</AnimatePresence>
						)}
					</MessageList>
				</div>
				<MessageInput className="hidden [@media(min-width:496px)]:block">
					<CreatePostForm threadId={threadId} />
				</MessageInput>
			</div>
		</Card>
	);
};
