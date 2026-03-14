"use client";

import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IconButton from "@/components/common/button/IconButton";

type EmojiProps = {
	onReactAction: (emoji: string) => void;
	reactionCodes: string[];
	selectedReactionCodes: string[];
	onOpenChangeAction?: (isOpen: boolean) => void;
};

type PickerPosition = {
	top: number;
	left: number;
	width: number;
};

const PICKER_WIDTH_PX = 332;
const PICKER_HEIGHT_PX = 56;
const PICKER_GAP_PX = 6;
const VIEWPORT_PADDING_PX = 8;

export function Emoji({
	onReactAction,
	reactionCodes,
	selectedReactionCodes,
	onOpenChangeAction,
}: EmojiProps) {
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const pickerRef = useRef<HTMLDivElement | null>(null);
	const onOpenChangeActionRef = useRef(onOpenChangeAction);
	const isOpenRef = useRef(isOpen);
	const [pickerPosition, setPickerPosition] = useState<PickerPosition | null>(
		null,
	);

	useEffect(() => {
		onOpenChangeActionRef.current = onOpenChangeAction;
	}, [onOpenChangeAction]);

	useEffect(() => {
		isOpenRef.current = isOpen;
		onOpenChangeActionRef.current?.(isOpen);
	}, [isOpen]);

	useEffect(() => {
		return () => {
			if (!isOpenRef.current) return;
			onOpenChangeActionRef.current?.(false);
		};
	}, []);

	const updatePickerPosition = useCallback(() => {
		const trigger = rootRef.current;
		if (!trigger) return;
		const triggerRect = trigger.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const width = Math.min(
			PICKER_WIDTH_PX,
			Math.max(120, viewportWidth - VIEWPORT_PADDING_PX * 2),
		);
		const centerX = triggerRect.left + triggerRect.width / 2;
		const left = Math.min(
			viewportWidth - width - VIEWPORT_PADDING_PX,
			Math.max(VIEWPORT_PADDING_PX, centerX - width / 2),
		);

		const topForAbove = triggerRect.top - PICKER_HEIGHT_PX - PICKER_GAP_PX;
		const topForBelow = triggerRect.bottom + PICKER_GAP_PX;
		const canShowAbove = topForAbove >= VIEWPORT_PADDING_PX;
		const canShowBelow =
			topForBelow + PICKER_HEIGHT_PX <= viewportHeight - VIEWPORT_PADDING_PX;
		const top = canShowAbove || !canShowBelow ? topForAbove : topForBelow;

		setPickerPosition({
			top: Math.max(
				VIEWPORT_PADDING_PX,
				Math.min(top, viewportHeight - PICKER_HEIGHT_PX - VIEWPORT_PADDING_PX),
			),
			left,
			width,
		});
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		updatePickerPosition();

		let frameId = 0;
		const scheduleReposition = () => {
			window.cancelAnimationFrame(frameId);
			frameId = window.requestAnimationFrame(updatePickerPosition);
		};

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (rootRef.current?.contains(target)) return;
			if (pickerRef.current?.contains(target)) return;
			setIsOpen(false);
		};

		document.addEventListener("pointerdown", handlePointerDown);
		window.addEventListener("resize", scheduleReposition);
		window.addEventListener("scroll", scheduleReposition, true);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			window.removeEventListener("resize", scheduleReposition);
			window.removeEventListener("scroll", scheduleReposition, true);
			window.cancelAnimationFrame(frameId);
		};
	}, [isOpen, updatePickerPosition]);

	const selectedCodeKey = selectedReactionCodes
		.map((c) => c.toLowerCase())
		.sort()
		.join(",");

	const getPickerButtons = useCallback(
		() =>
			pickerRef.current?.querySelectorAll<HTMLButtonElement>(
				".kotobad-reaction-picker .epr-emoji",
			),
		[],
	);

	useEffect(() => {
		if (!isOpen) return;

		const selectedCodeSet = new Set(
			selectedCodeKey ? selectedCodeKey.split(",") : [],
		);
		let retries = 0;
		const applySelectedState = () => {
			const buttons = getPickerButtons();
			if (!buttons?.length) {
				if (retries < 6) {
					retries += 1;
					window.requestAnimationFrame(applySelectedState);
				}
				return;
			}

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
	}, [isOpen, selectedCodeKey, getPickerButtons]);

	useEffect(() => {
		if (!isOpen) return;

		let rafId = 0;
		let animations: Animation[] = [];
		let retries = 0;

		const animatePickerButtons = () => {
			const buttons = getPickerButtons();
			if (!buttons?.length) {
				if (retries < 6) {
					retries += 1;
					rafId = window.requestAnimationFrame(animatePickerButtons);
				}
				return;
			}

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
		};

		rafId = window.requestAnimationFrame(animatePickerButtons);

		return () => {
			window.cancelAnimationFrame(rafId);
			for (const animation of animations) {
				animation.cancel();
			}
		};
	}, [isOpen, getPickerButtons]);

	return (
		<div ref={rootRef} className="relative inline-flex w-fit">
			<IconButton
				enableClickAnimation
				type="button"
				size="icon"
				variant="outline"
				className="group h-8 w-8 rounded-full border-0 p-0 text-[#1e3a8a] dark:text-[#dbeafe]"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-label="リアクション絵文字を開く"
				icon={
					<SmilePlus className="h-4 w-4 text-current transition-colors group-hover:fill-yellow-300" />
				}
			/>
			{isOpen
				? createPortal(
						<>
							<button
								type="button"
								className="fixed inset-0 z-[60] animate-fade-in"
								aria-label="リアクション絵文字を閉じる"
								onClick={() => setIsOpen(false)}
							/>
							<div
								ref={pickerRef}
								className="fixed z-[70] origin-center"
								style={{
									top: pickerPosition?.top ?? VIEWPORT_PADDING_PX,
									left: pickerPosition?.left ?? VIEWPORT_PADDING_PX,
									width: pickerPosition?.width ?? PICKER_WIDTH_PX,
								}}
							>
								<div className="rounded-xl">
									<EmojiPicker
										className="kotobad-reaction-picker shadow-float bg-white"
										autoFocusSearch={false}
										searchDisabled
										width="100%"
										height={PICKER_HEIGHT_PX}
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
						</>,
						document.body,
					)
				: null}
		</div>
	);
}
