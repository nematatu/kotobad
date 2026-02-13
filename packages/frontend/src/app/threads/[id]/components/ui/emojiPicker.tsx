"use client";

import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/common/button/IconButton";

type EmojiProps = {
	onReactAction: (emoji: string) => void;
};

export function Emoji({ onReactAction }: EmojiProps) {
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
				<div className="absolute left-0 bottom-[calc(100%+0.5rem)] z-[70] origin-bottom-left animate-emoji-pop-in">
					<div className="w-[20rem] max-w-[calc(100vw-1rem)] rounded-xl">
						<EmojiPicker
							autoFocusSearch={false}
							searchDisabled
							width="100%"
							height={300}
							style={{ width: "100%" }}
							previewConfig={{ showPreview: false }}
							reactionsDefaultOpen
							allowExpandReactions={false}
							reactions={[
								"1f44d",
								"1f604",
								"2764-fe0f",
								"1f389",
								"1f3f8",
								"1f440",
								"1f914",
								"1f44e",
							]}
							onReactionClick={(emojiData) => {
								onReactAction(emojiData.emoji);
								setIsOpen(false);
							}}
							onEmojiClick={(emojiData) => {
								onReactAction(emojiData.emoji);
								setIsOpen(false);
							}}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}
