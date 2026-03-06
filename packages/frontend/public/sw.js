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

self.addEventListener("push", (event) => {
	let payload = {
		title: "新しい返信があります",
		body: "コトバドで返信を確認できます",
		url: "/threads",
		tag: "thread-reply",
	};

	try {
		const parsed = event.data?.json();
		if (parsed && typeof parsed === "object") {
			if (typeof parsed.title === "string" && parsed.title.length > 0) {
				payload.title = parsed.title;
			}
			if (typeof parsed.body === "string" && parsed.body.length > 0) {
				payload.body = parsed.body;
			}
			if (typeof parsed.url === "string" && parsed.url.length > 0) {
				payload.url = parsed.url;
			}
			if (typeof parsed.tag === "string" && parsed.tag.length > 0) {
				payload.tag = parsed.tag;
			}
		}
	} catch {
		// Ignore payload parse errors.
	}

	event.waitUntil(
		self.registration.showNotification(payload.title, {
			body: payload.body,
			tag: payload.tag,
			icon: "/pwa-192x192.png",
			badge: "/pwa-192x192.png",
			data: {
				url: payload.url,
			},
		}),
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const targetPath = event.notification?.data?.url || "/threads";
	const absoluteUrl = new URL(targetPath, self.location.origin).toString();

	event.waitUntil(clients.openWindow(absoluteUrl));
});
