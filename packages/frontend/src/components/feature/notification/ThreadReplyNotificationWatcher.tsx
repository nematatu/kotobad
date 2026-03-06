"use client";

import { ThreadReplyNotificationListSchema } from "@kotobad/shared/src/schemas/post";
import { useEffect, useRef } from "react";

const POLLING_INTERVAL_MS = 30_000;
const STORAGE_LAST_SEEN_KEY = "kotobad:reply-notify:last-seen";
const STORAGE_NOTIFIED_POST_IDS_KEY = "kotobad:reply-notify:post-ids";
const STORAGE_NOTIFIED_POST_IDS_MAX = 200;

const toEpochSeconds = (dateString: string): number => {
	const timestamp = Date.parse(dateString);
	if (!Number.isFinite(timestamp)) {
		return 0;
	}
	return Math.floor(timestamp / 1000);
};

const readLastSeen = (): number => {
	try {
		const raw = localStorage.getItem(STORAGE_LAST_SEEN_KEY);
		if (!raw) {
			return 0;
		}
		const parsed = Number(raw);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
	} catch {
		return 0;
	}
};

const writeLastSeen = (value: number): void => {
	try {
		localStorage.setItem(STORAGE_LAST_SEEN_KEY, String(value));
	} catch {
		// Ignore storage failures.
	}
};

const readNotifiedPostIds = (): number[] => {
	try {
		const raw = localStorage.getItem(STORAGE_NOTIFIED_POST_IDS_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}
		return parsed
			.map((value) => Number(value))
			.filter((value) => Number.isInteger(value) && value > 0);
	} catch {
		return [];
	}
};

const writeNotifiedPostIds = (postIds: number[]): void => {
	try {
		localStorage.setItem(
			STORAGE_NOTIFIED_POST_IDS_KEY,
			JSON.stringify(postIds),
		);
	} catch {
		// Ignore storage failures.
	}
};

type NotificationPayload = {
	title: string;
	body: string;
	url: string;
	tag: string;
};

async function pushLocalNotification(
	payload: NotificationPayload,
): Promise<void> {
	if (typeof window === "undefined" || !("Notification" in window)) {
		return;
	}
	if (Notification.permission !== "granted") {
		return;
	}

	if ("serviceWorker" in navigator) {
		const registration =
			(await navigator.serviceWorker.getRegistration()) ??
			(await navigator.serviceWorker.ready.catch(() => null));
		if (registration) {
			await registration.showNotification(payload.title, {
				body: payload.body,
				tag: payload.tag,
				icon: "/pwa-192x192.png",
				badge: "/pwa-192x192.png",
				data: { url: payload.url },
			});
			return;
		}
	}

	new Notification(payload.title, {
		body: payload.body,
		tag: payload.tag,
	});
}

export function ThreadReplyNotificationWatcher() {
	const isInitialFetchRef = useRef(true);
	const isFetchingRef = useRef(false);

	useEffect(() => {
		if (typeof window === "undefined" || !("Notification" in window)) {
			return;
		}

		const poll = async () => {
			if (isFetchingRef.current) {
				return;
			}

			if (document.visibilityState === "hidden") {
				return;
			}

			isFetchingRef.current = true;

			try {
				const params = new URLSearchParams({ limit: "20" });
				const since = readLastSeen();
				if (since > 0) {
					params.set("since", String(since));
				}

				const response = await fetch(
					`/threads/api/posts/getThreadReplyNotifications?${params.toString()}`,
					{
						method: "GET",
						cache: "no-store",
					},
				);

				if (response.status === 401) {
					return;
				}
				if (!response.ok) {
					return;
				}

				const raw = await response.json();
				const parsed = ThreadReplyNotificationListSchema.parse(raw);
				const notifications = parsed.notifications;
				if (notifications.length === 0) {
					return;
				}

				let maxSeen = since;
				for (const notification of notifications) {
					const createdAt = toEpochSeconds(notification.createdAt);
					if (createdAt > maxSeen) {
						maxSeen = createdAt;
					}
				}

				const notifiedPostIds = readNotifiedPostIds();
				const notifiedPostIdSet = new Set(notifiedPostIds);

				if (!isInitialFetchRef.current) {
					const orderedNotifications = [...notifications].sort(
						(a, b) => toEpochSeconds(a.createdAt) - toEpochSeconds(b.createdAt),
					);
					for (const notification of orderedNotifications) {
						if (notifiedPostIdSet.has(notification.postId)) {
							continue;
						}

						await pushLocalNotification({
							title: `${notification.repliedBy.name} さんが返信しました`,
							body: `${notification.threadTitle} / ${notification.postExcerpt}`,
							url: `/threads/${notification.threadId}?postId=${notification.postId}`,
							tag: `reply:${notification.postId}`,
						});
					}
				}

				for (const notification of notifications) {
					notifiedPostIdSet.add(notification.postId);
				}

				const nextNotifiedPostIds = Array.from(notifiedPostIdSet).slice(
					-STORAGE_NOTIFIED_POST_IDS_MAX,
				);
				writeNotifiedPostIds(nextNotifiedPostIds);
				if (maxSeen > 0) {
					writeLastSeen(maxSeen);
				}
			} catch (_error) {
				// Ignore polling errors to keep UX unaffected.
			} finally {
				isInitialFetchRef.current = false;
				isFetchingRef.current = false;
			}
		};

		void poll();
		const intervalId = window.setInterval(() => {
			void poll();
		}, POLLING_INTERVAL_MS);

		const onVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				void poll();
			}
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, []);

	return null;
}
