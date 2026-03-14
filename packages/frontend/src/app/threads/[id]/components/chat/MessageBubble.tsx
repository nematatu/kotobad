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
				"mb-3 flex scroll-mt-24",
				fullWidth ? "w-full" : "w-auto max-w-full",
				isMine ? "justify-end" : "justify-start",
				className,
			)}
		>
			<div
				className={cn("relative", depth > 0 && !isMine ? "ml-1.5 sm:ml-3" : "")}
			>
				<div
					className={cn(
						"inline-flex w-auto min-w-0 max-w-[calc(100vw-7rem)] flex-col rounded-[18px] px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.1)] sm:max-w-[42rem]",
						isMine
							? "rounded-br-[6px] bg-[#e0ecff] text-[#0f172a] dark:bg-[#1d3f6e] dark:text-[#e2ecff]"
							: "rounded-bl-[6px] bg-[#ffffff] text-[#111827] dark:bg-[#1f2937] dark:text-[#e5e7eb]",
						isHighlighted
							? "ring-2 ring-amber-300 shadow-[0_0_0_1px_rgba(251,191,36,0.4)]"
							: "",
					)}
				>
					{children}
				</div>
				{timeLabel ? (
					<span
						className={
							isMine
								? "pointer-events-none absolute bottom-1 right-[calc(100%+0.35rem)] select-none whitespace-nowrap text-[#1e3a8a] text-[10px] leading-none dark:text-[#bfdbfe]"
								: "pointer-events-none absolute bottom-1 left-[calc(100%+0.35rem)] select-none whitespace-nowrap text-[#6b7280] text-[10px] leading-none dark:text-[#94a3b8]"
						}
					>
						{timeLabel}
					</span>
				) : null}
			</div>
		</motion.div>
	);
};
