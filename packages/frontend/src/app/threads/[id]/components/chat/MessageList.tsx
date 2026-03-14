"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type MessageListProps = {
	children: ReactNode;
	autoScrollKey: number;
	autoScrollEnabled?: boolean;
	className?: string;
};

export const MessageList = ({
	children,
	autoScrollKey,
	autoScrollEnabled = true,
	className,
}: MessageListProps) => {
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!autoScrollEnabled) return;
		const bottomElement = bottomRef.current;
		if (!bottomElement) return;
		if (autoScrollKey < 0) return;

		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
			.matches
			? "auto"
			: "smooth";

		const rafId = window.requestAnimationFrame(() => {
			bottomElement.scrollIntoView({
				behavior,
				block: "end",
			});
		});

		return () => window.cancelAnimationFrame(rafId);
	}, [autoScrollEnabled, autoScrollKey]);

	return (
		<div className={cn("bg-transparent px-3 py-4 sm:px-4", className)}>
			{children}
			<div ref={bottomRef} className="h-0 w-full" aria-hidden="true" />
		</div>
	);
};
