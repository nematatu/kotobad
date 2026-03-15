"use client";

import { useEffect } from "react";

const SPLASH_HIDE_CLASS = "initial-splash--hidden";

export default function SplashGate() {
	useEffect(() => {
		const splash = document.getElementById("initial-splash");
		if (!splash) {
			return;
		}

		requestAnimationFrame(() => splash.classList.add(SPLASH_HIDE_CLASS));
		const hideTimeout = window.setTimeout(() => {
			splash.style.display = "none";
		}, 300);

		return () => {
			window.clearTimeout(hideTimeout);
		};
	}, []);

	return null;
}
