"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { MoveDown } from "@/components/animate-ui/icons/move-down";
import { MoveUp } from "@/components/animate-ui/icons/move-up";

const SWITCH_THRESHOLD_PX = 200;

export default function ScrollToBottomButton() {
	const [isNearBottom, setIsNearBottom] = useState(false);

	useEffect(() => {
		const updatePositionState = () => {
			const viewportBottom = window.scrollY + window.innerHeight;
			const pageBottom = document.documentElement.scrollHeight;
			setIsNearBottom(viewportBottom >= pageBottom - SWITCH_THRESHOLD_PX);
		};

		updatePositionState();
		window.addEventListener("scroll", updatePositionState, { passive: true });
		window.addEventListener("resize", updatePositionState);

		return () => {
			window.removeEventListener("scroll", updatePositionState);
			window.removeEventListener("resize", updatePositionState);
		};
	}, []);

	const targetId = isNearBottom ? "page-top-anchor" : "thread-page-bottom";
	const href = `#${targetId}`;
	const ariaLabel = isNearBottom ? "ページ最上部へ移動" : "ページ最下部へ移動";
	const iconClassName = "h-8 w-8 sm:h-[30px] sm:w-[30px]";
	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
			.matches
			? "auto"
			: "smooth";
		if (isNearBottom) {
			event.preventDefault();
			window.scrollTo({ top: 0, behavior });
			return;
		}

		const target = document.getElementById("thread-page-bottom");
		if (!target) {
			return;
		}
		event.preventDefault();
		target.scrollIntoView({ behavior, block: "start" });
	};

	return (
		<AnimateIcon animateOnHover asChild>
			<a
				href={href}
				aria-label={ariaLabel}
				onClick={handleClick}
				className="fixed bottom-20 sm:bottom-40 right-4 sm:right-10 z-[60] inline-flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white transition-all duration-200 hover:bg-blue-500/80 hover:shadow-card"
			>
				{isNearBottom ? (
					<MoveUp size={20} className={iconClassName} />
				) : (
					<MoveDown size={20} className={iconClassName} />
				)}
			</a>
		</AnimateIcon>
	);
}
