"use client";

import { useEffect } from "react";

const PwaRegister = () => {
	useEffect(() => {
		if (!("serviceWorker" in navigator)) {
			return;
		}

		const registerServiceWorker = async () => {
			try {
				await navigator.serviceWorker.register("/sw.js", { scope: "/" });
			} catch (_error) {
				// Registration failure should not block page rendering.
			}
		};

		registerServiceWorker();
	}, []);

	return null;
};

export default PwaRegister;
