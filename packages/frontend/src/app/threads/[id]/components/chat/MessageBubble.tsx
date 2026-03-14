"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
	postId: number;
	isMine: boolean;
	isHighlighted?: boolean;
	depth?: number;
	enterDelayMs?: number;
	animateOnMount?: boolean;
	fullWidth?: boolean;
	timeLabel?: string;
	reactionPicker?: ReactNode;
	isReactionPickerOpen?: boolean;
	children: ReactNode;
	className?: string;
};

const bubbleTransition = {
	duration: 0.24,
	ease: [0.22, 1, 0.36, 1] as const,
};

export const MessageBubble = ({
	postId,
	isMine,
	isHighlighted = false,
	depth = 0,
	enterDelayMs = 0,
	animateOnMount = true,
	fullWidth = true,
	timeLabel,
	reactionPicker,
	isReactionPickerOpen = false,
	children,
	className,
}: MessageBubbleProps) => {
	return (
		<motion.div
			id={`post-${postId}`}
			initial={animateOnMount ? { opacity: 0, y: 10 } : false}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -6 }}
			transition={{
				...bubbleTransition,
				delay: animateOnMount ? Math.max(0, enterDelayMs) / 1000 : 0,
			}}
			className={cn(
				"mb-1 flex scroll-mt-24",
				fullWidth ? "w-full" : "w-auto max-w-full",
				isMine ? "justify-end" : "justify-start pl-2",
				className,
			)}
		>
			<div
				className={cn(
					"group/message inline-flex items-end gap-1.5",
					isMine ? "flex-row-reverse -ml-3 pl-3" : "flex-row -mr-3 pr-3",
					depth > 0 && !isMine ? "ml-1.5 sm:ml-3" : "",
				)}
			>
				<div
					className={cn(
						"inline-flex w-auto min-w-0 max-w-[calc(100vw-7rem)] flex-col rounded-[18px] px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.1)] sm:max-w-[42rem]",
						isMine
							? "rounded-tr-[6px] bg-[#e0ecff] text-[#0f172a] dark:bg-[#1d3f6e] dark:text-[#e2ecff]"
							: "rounded-tl-[6px] bg-[#ffffff] text-[#111827] dark:bg-[#1f2937] dark:text-[#e5e7eb]",
						isHighlighted
							? "ring-2 ring-amber-300 shadow-[0_0_0_1px_rgba(251,191,36,0.4)]"
							: "",
					)}
				>
					{children}
				</div>
				{reactionPicker || timeLabel ? (
					<div
						className={cn(
							"relative h-8 w-[5.25rem] shrink-0",
							isMine ? "pr-3" : "pl-3",
						)}
					>
						{reactionPicker ? (
							<div
								className={cn(
									"absolute inset-0 z-20 flex items-center transition-opacity duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity]",
									isMine ? "justify-end" : "justify-start",
									isReactionPickerOpen
										? "opacity-100 pointer-events-auto"
										: "opacity-0 pointer-events-none group-hover/message:opacity-100 group-hover/message:pointer-events-auto group-focus-within/message:opacity-100 group-focus-within/message:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
								)}
							>
								{reactionPicker}
							</div>
						) : null}
						{timeLabel ? (
							<div
								className={cn(
									"absolute inset-0 flex items-center transition-opacity duration-180 ease-[cubic-bezier(0.22,1,0.36,1)]",
									isMine ? "justify-end" : "justify-start",
									reactionPicker
										? isReactionPickerOpen
											? "opacity-0"
											: "opacity-100 group-hover/message:opacity-0 group-focus-within/message:opacity-0 [@media(hover:none)]:opacity-0"
										: "opacity-100",
								)}
							>
								<span
									className={
										isMine
											? "pointer-events-none select-none whitespace-nowrap tabular-nums text-[#1e3a8a] text-[10px] leading-none dark:text-[#bfdbfe]"
											: "pointer-events-none select-none whitespace-nowrap tabular-nums text-[#6b7280] text-[10px] leading-none dark:text-[#94a3b8]"
									}
								>
									{timeLabel}
								</span>
							</div>
						) : null}
					</div>
				) : null}
			</div>
		</motion.div>
	);
};
