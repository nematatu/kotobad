"use client";

import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/common/button/IconButton";

type EmojiProps = {
	onReactAction: (emoji: string) => void;
	reactionCodes: string[];
	selectedReactionCodes: string[];
};

export function Emoji({
	onReactAction,
	reactionCodes,
	selectedReactionCodes,
}: EmojiProps) {
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

	const selectedCodeKey = selectedReactionCodes
		.map((c) => c.toLowerCase())
		.sort()
		.join(",");

	useEffect(() => {
		if (!isOpen) return;

		const selectedCodeSet = new Set(
			selectedCodeKey ? selectedCodeKey.split(",") : [],
		);
		const applySelectedState = () => {
			const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>(
				".kotobad-reaction-picker .epr-emoji",
			);
			if (!buttons?.length) return;

			for (const button of buttons) {
				const unified = button.dataset.unified?.toLowerCase();
				const isSelected = Boolean(unified && selectedCodeSet.has(unified));
				button.classList.toggle("kotobad-reaction-selected", isSelected);
			}
		};

		const rafId = window.requestAnimationFrame(applySelectedState);

		return () => {
			window.cancelAnimationFrame(rafId);
		};
	}, [isOpen, selectedCodeKey]);

	useEffect(() => {
		if (!isOpen) return;

		let rafId = 0;
		let animations: Animation[] = [];

		rafId = window.requestAnimationFrame(() => {
			const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>(
				".kotobad-reaction-picker .epr-emoji",
			);
			if (!buttons?.length) return;

			animations = Array.from(buttons).map((button, index) => {
				button.style.transformOrigin = "center";
				button.style.willChange = "transform, opacity";
				return button.animate(
					[
						{ opacity: 0, transform: "scale(0.2)" },
						{ opacity: 1, transform: "scale(1.5)", offset: 0.72 },
						{ opacity: 1, transform: "scale(1)" },
					],
					{
						duration: 180,
						delay: index * 25,
						easing: "cubic-bezier(0.16, 1, 0.3, 1)",
						fill: "both",
					},
				);
			});
		});

		return () => {
			window.cancelAnimationFrame(rafId);
			for (const animation of animations) {
				animation.cancel();
			}
		};
	}, [isOpen]);

	return (
		<div ref={rootRef} className="relative inline-flex w-fit">
			<IconButton
				enableClickAnimation
				type="button"
				size="icon"
				variant="outline"
				className="group h-5 w-5 rounded-full border-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-label="リアクション絵文字を開く"
				icon={
					<SmilePlus className="h-5 w-5 text-slate-600 transition-colors group-hover:fill-yellow-300" />
				}
			/>
			{isOpen ? (
				<>
					<button
						type="button"
						className="fixed inset-0 z-[60] animate-fade-in"
						aria-label="リアクション絵文字を閉じる"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute left-[calc(100%)] bottom-[calc(100%+0.3rem)] z-[70] origin-bottom-left">
						<div className="w-[20rem] max-w-[calc(100vw-1rem)] rounded-xl">
							<EmojiPicker
								className="kotobad-reaction-picker shadow-float bg-white"
								autoFocusSearch={false}
								searchDisabled
								width="100%"
								height={300}
								style={{ width: "100%" }}
								previewConfig={{ showPreview: false }}
								reactionsDefaultOpen
								allowExpandReactions={false}
								reactions={reactionCodes}
								onReactionClick={(emojiData) => {
									onReactAction(emojiData.unified);
									setIsOpen(false);
								}}
								onEmojiClick={(emojiData) => {
									onReactAction(emojiData.unified);
									setIsOpen(false);
								}}
							/>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}
