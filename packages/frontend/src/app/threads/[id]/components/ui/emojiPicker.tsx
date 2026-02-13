"use client";

import { SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/common/button/IconButton";

const QUICK_REACTIONS = ["👍", "❤️", "🎉", "👀", "🤔", "🏸"] as const;
const REACTION_ROWS = [
	QUICK_REACTIONS.slice(0, 3),
	QUICK_REACTIONS.slice(3, 6),
];

type EmojiProps = {
	onReactAction: (emoji: string) => void;
	selectedEmojis?: Record<string, true>;
};

export function Emoji({ onReactAction, selectedEmojis }: EmojiProps) {
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (rootRef.current?.contains(target)) return;
			setIsOpen(false);
		};

		document.addEventListener("pointerdown", handlePointerDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [isOpen]);

	return (
		<div
			ref={rootRef}
			className="relative inline-flex w-fit self-start items-center"
		>
			<IconButton
				enableClickAnimation
				type="button"
				size="icon"
				variant="outline"
				className="group h-10 w-10 rounded-full border-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-label="リアクション絵文字を開く"
				icon={
					<SmilePlus className="h-5 w-5 text-slate-600 transition-colors group-hover:fill-yellow-300" />
				}
			/>
			{isOpen ? (
				<div className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 z-[70] overflow-hidden animate-emoji-expand-x">
					<div className="w-max rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
						<div className="flex flex-col gap-1.5">
							{REACTION_ROWS.map((row, rowIndex) => (
								<div
									key={`emoji-row-${rowIndex + 1}`}
									className="flex items-center gap-3 p-1"
								>
									{row.map((reaction) => (
										<button
											type="button"
											key={reaction}
											onClick={() => {
												onReactAction(reaction);
												setIsOpen(false);
											}}
											aria-label={`${reaction} でリアクション`}
											className={`relative z-0 flex px-2 py-1 scale-120 cursor-pointer items-center justify-center leading-none transform-gpu transition duration-150 ease-out hover:z-10 hover:scale-200 ${
												selectedEmojis?.[reaction]
													? "rounded-sm bg-sky-100/85 ring-1 ring-sky-400/80"
													: ""
											}`}
										>
											{reaction}
										</button>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
