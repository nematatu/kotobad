"use client";

import { useEffect, useState } from "react";

export const DEMO_STORAGE_KEY = "kotobad_demo_mode";
export const DEMO_CHANGE_EVENT = "kotobad_demo_mode_change";

export const isDemoModeActive = (): boolean => {
	if (typeof window === "undefined") {
		return false;
	}

	try {
		const searchParams = new URLSearchParams(window.location.search);
		const demoParam = searchParams.get("demo");

		if (demoParam === "false" || demoParam === "0") {
			window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
			return false;
		}

		if (demoParam === "true" || demoParam === "1" || searchParams.has("demo")) {
			window.sessionStorage.setItem(DEMO_STORAGE_KEY, "true");
			return true;
		}

		if (window.sessionStorage.getItem(DEMO_STORAGE_KEY) === "true") {
			return true;
		}

		if (window.location.hostname.startsWith("demo.")) {
			return true;
		}
	} catch {
		// Ignore sessionStorage/URL errors in strict sandboxes
	}

	return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";
};

export const setDemoMode = (enabled: boolean): void => {
	if (typeof window === "undefined") {
		return;
	}

	try {
		if (enabled) {
			window.sessionStorage.setItem(DEMO_STORAGE_KEY, "true");
		} else {
			window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
		}
	} catch {}

	window.dispatchEvent(new CustomEvent(DEMO_CHANGE_EVENT, { detail: enabled }));
};

export const useDemoMode = () => {
	const [isDemo, setIsDemo] = useState(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const update = () => {
			setIsDemo(isDemoModeActive());
			setIsReady(true);
		};

		update();

		const onDemoChange = (event: Event) => {
			const customEvent = event as CustomEvent<boolean>;
			setIsDemo(Boolean(customEvent.detail));
		};

		window.addEventListener(DEMO_CHANGE_EVENT, onDemoChange);
		return () => {
			window.removeEventListener(DEMO_CHANGE_EVENT, onDemoChange);
		};
	}, []);

	return {
		isDemo,
		isReady,
		setDemoMode,
	};
};
