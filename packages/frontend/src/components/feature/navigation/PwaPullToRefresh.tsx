"use client";

import { ArrowDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const REFRESH_TRIGGER_PX = 84;
const MAX_PULL_PX = 128;

type NavigatorWithStandalone = Navigator & {
	standalone?: boolean;
};

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) {
		return false;
	}
	return (
		target.closest("input, textarea, select, [contenteditable='true']") !== null
	);
}

export default function PwaPullToRefresh() {
	const startYRef = useRef(0);
	const pullDistanceRef = useRef(0);
	const isTrackingRef = useRef(false);
	const isRefreshingRef = useRef(false);
	const [isEnabled, setIsEnabled] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [pullDistance, setPullDistance] = useState(0);
	const [isReady, setIsReady] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const indicatorLabel = useMemo(() => {
		if (isRefreshing) {
			return "更新中...";
		}
		if (isReady) {
			return "離して更新";
		}
		return "下にスワイプで更新";
	}, [isRefreshing, isReady]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as NavigatorWithStandalone).standalone === true;

		if (!isStandalone) {
			setIsEnabled(false);
			return;
		}
		setIsEnabled(true);

		const resetPull = () => {
			isTrackingRef.current = false;
			pullDistanceRef.current = 0;
			setPullDistance(0);
			setIsReady(false);
			setIsVisible(false);
		};

		const onTouchStart = (event: TouchEvent) => {
			if (isRefreshingRef.current) {
				return;
			}
			if (document.body.dataset.createThreadDrawerOpen === "true") {
				resetPull();
				return;
			}
			if (event.touches.length !== 1) {
				resetPull();
				return;
			}
			if (window.scrollY > 0) {
				resetPull();
				return;
			}
			if (isEditableTarget(event.target)) {
				resetPull();
				return;
			}
			isTrackingRef.current = true;
			startYRef.current = event.touches[0]?.clientY ?? 0;
			pullDistanceRef.current = 0;
			setPullDistance(0);
			setIsReady(false);
		};

		const onTouchMove = (event: TouchEvent) => {
			if (!isTrackingRef.current || isRefreshingRef.current) {
				return;
			}
			if (event.touches.length !== 1) {
				resetPull();
				return;
			}

			const currentY = event.touches[0]?.clientY ?? 0;
			const delta = currentY - startYRef.current;
			if (delta <= 0) {
				return;
			}

			const clamped = Math.min(delta, MAX_PULL_PX);
			pullDistanceRef.current = clamped;
			setPullDistance(clamped);
			setIsVisible(true);
			setIsReady(clamped >= REFRESH_TRIGGER_PX);
			event.preventDefault();
		};

		const onTouchEnd = () => {
			if (!isTrackingRef.current || isRefreshingRef.current) {
				resetPull();
				return;
			}

			const shouldRefresh = pullDistanceRef.current >= REFRESH_TRIGGER_PX;
			const nextDistance = pullDistanceRef.current;
			if (!shouldRefresh) {
				resetPull();
				return;
			}

			isRefreshingRef.current = true;
			isTrackingRef.current = false;
			setPullDistance(nextDistance);
			setIsRefreshing(true);
			setIsVisible(true);
			window.setTimeout(() => {
				window.location.reload();
			}, 160);
		};

		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: false });
		window.addEventListener("touchend", onTouchEnd, { passive: true });
		window.addEventListener("touchcancel", onTouchEnd, { passive: true });

		return () => {
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("touchcancel", onTouchEnd);
		};
	}, []);

	if (!isEnabled && !isVisible && !isRefreshing) {
		return null;
	}

	const progress = Math.min(1, pullDistance / REFRESH_TRIGGER_PX);
	const translateY = isRefreshing
		? 52
		: isVisible
			? Math.min(52, pullDistance * 0.42)
			: -60;
	const iconRotate = `${Math.round(progress * 180)}deg`;

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed left-1/2 top-[calc(env(safe-area-inset-top)+0.4rem)] z-[70] transition-[opacity,transform] duration-150 ease-out"
			style={{
				opacity: isVisible || isRefreshing ? 1 : 0,
				transform: `translate(-50%, ${translateY}px)`,
			}}
		>
			<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-slate-700 shadow-sm backdrop-blur">
				<span className="inline-flex size-5 items-center justify-center text-blue-600">
					{isRefreshing ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<ArrowDown
							className={cn(
								"h-4 w-4 transition-transform duration-100",
								isReady ? "text-blue-700" : "text-blue-500",
							)}
							style={{ transform: `rotate(${iconRotate})` }}
						/>
					)}
				</span>
				<span className="text-[11px] font-semibold whitespace-nowrap">
					{indicatorLabel}
				</span>
			</div>
		</div>
	);
}
