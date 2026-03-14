"use client";

import type { PostReactionType } from "@kotobad/shared/src/types/reaction";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type MessageReactionProps = {
	postId: number;
	reactions: PostReactionType[];
	isMine: boolean;
	onReactAction: (reactionCode: string) => void;
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

export const MessageReaction = ({
	postId,
	reactions,
	isMine,
	onReactAction,
}: MessageReactionProps) => {
	return (
		<AnimatePresence initial={false}>
			{reactions.length > 0 ? (
				<motion.div
					key={`${postId}:reactions`}
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
							? "mt-0 flex flex-wrap items-center justify-end gap-2 pr-1"
							: "mt-0 flex flex-wrap items-center gap-2 pl-1"
					}
				>
					{reactions.map(({ id, reactionCode, emoji, reactedByMe, count }) => {
						const isReacted = reactedByMe;
						return (
							<button
								type="button"
								key={`${postId}:${reactionCode}:${id}`}
								className={`inline-flex cursor-pointer items-center gap-1 rounded-full border-0 bg-transparent px-2 py-1 text-xs leading-none font-semibold shadow-none transition-colors duration-150 ${
									isReacted
										? isMine
											? "text-[#1d4f91] dark:text-[#dbeafe]"
											: "text-[#16a34a] dark:text-[#86efac]"
										: isMine
											? "text-[#64748b] hover:text-[#1d4f91] dark:text-[#94a3b8] dark:hover:text-[#dbeafe]"
											: "text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-[#e5e7eb]"
								}`}
								onClick={() => onReactAction(reactionCode)}
								aria-label={`${emoji} をリアクション`}
							>
								<span>{emoji}</span>
								<ReactionCount count={count} />
							</button>
						);
					})}
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
