"use client";

import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/common/button/IconButton";

export function Emoji() {
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (event: PointerEvent) => {
			const targetNode = event.target;
			if (!(targetNode instanceof Node)) return;
			if (rootRef.current?.contains(targetNode)) return;
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
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-label="絵文字ピッカーを開く"
				icon={
					<SmilePlus className="h-5 w-5 text-slate-600 transition-colors group-hover:fill-yellow-300" />
				}
			/>
			{isOpen && (
				<div className="absolute left-[calc(100%+0.5rem)] top-1/2 z-[70] origin-left animate-emoji-pop-in">
					<EmojiPicker
						style={{
							width: "100%",
						}}
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
					/>
				</div>
			)}
		</div>
	);
}
