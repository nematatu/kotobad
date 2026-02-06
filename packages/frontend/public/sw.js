const SW_VERSION = "kotobad-sw-v1";

self.addEventListener("install", (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
	// Intentionally no custom caching to avoid stale static-asset issues.
});
