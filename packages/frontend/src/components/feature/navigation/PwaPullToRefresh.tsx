"use client";

import { useEffect, useRef } from "react";

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

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as NavigatorWithStandalone).standalone === true;

		if (!isStandalone) {
			return;
		}

		const resetPull = () => {
			isTrackingRef.current = false;
			pullDistanceRef.current = 0;
		};

		const onTouchStart = (event: TouchEvent) => {
			if (isRefreshingRef.current) {
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

			pullDistanceRef.current = Math.min(delta, MAX_PULL_PX);
			event.preventDefault();
		};

		const onTouchEnd = () => {
			if (!isTrackingRef.current || isRefreshingRef.current) {
				resetPull();
				return;
			}

			const shouldRefresh = pullDistanceRef.current >= REFRESH_TRIGGER_PX;
			resetPull();
			if (!shouldRefresh) {
				return;
			}

			isRefreshingRef.current = true;
			window.location.reload();
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

	return null;
}
