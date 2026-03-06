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
<<<<<<< HEAD

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const targetPath = event.notification?.data?.url || "/threads";
	const absoluteUrl = new URL(targetPath, self.location.origin).toString();

	event.waitUntil(clients.openWindow(absoluteUrl));
});
=======
>>>>>>> parent of 6dd3baf (feat: pwa通知デモ)
