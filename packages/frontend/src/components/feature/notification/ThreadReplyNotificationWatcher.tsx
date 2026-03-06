"use client";

import {
	SetThreadReplyPushSubscriptionSchema,
	ThreadReplyNotificationListSchema,
} from "@kotobad/shared/src/schemas/post";
import { useEffect, useRef } from "react";
import { useUser } from "@/components/feature/provider/UserProvider";

const POLLING_INTERVAL_MS = 30_000;
const STORAGE_CURSOR_KEY_PREFIX = "kotobad:reply-notify:cursor";
const STORAGE_NOTIFIED_POST_IDS_KEY_PREFIX = "kotobad:reply-notify:post-ids";
const STORAGE_NOTIFIED_POST_IDS_MAX = 200;

type NotificationCursor = {
	createdAt: number;
	postId: number;
};

const toEpochSeconds = (dateString: string): number => {
	const timestamp = Date.parse(dateString);
	if (!Number.isFinite(timestamp)) {
		return 0;
	}
	return Math.floor(timestamp / 1000);
};

const toScopedStorageKey = (prefix: string, userId: string): string =>
	`${prefix}:${userId}`;

const readCursor = (userId: string): NotificationCursor | null => {
	try {
		const raw = localStorage.getItem(
			toScopedStorageKey(STORAGE_CURSOR_KEY_PREFIX, userId),
		);
		if (!raw) {
			return null;
		}
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") {
			return null;
		}
		const createdAt = Number((parsed as { createdAt?: unknown }).createdAt);
		const postId = Number((parsed as { postId?: unknown }).postId);
		if (
			!Number.isInteger(createdAt) ||
			createdAt < 0 ||
			!Number.isInteger(postId) ||
			postId <= 0
		) {
			return null;
		}
		return { createdAt, postId };
	} catch {
		return null;
	}
};

const writeCursor = (userId: string, cursor: NotificationCursor): void => {
	try {
		localStorage.setItem(
			toScopedStorageKey(STORAGE_CURSOR_KEY_PREFIX, userId),
			JSON.stringify(cursor),
		);
	} catch {
		// Ignore storage failures.
	}
};

const readNotifiedPostIds = (userId: string): number[] => {
	try {
		const raw = localStorage.getItem(
			toScopedStorageKey(STORAGE_NOTIFIED_POST_IDS_KEY_PREFIX, userId),
		);
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

const writeNotifiedPostIds = (userId: string, postIds: number[]): void => {
	try {
		localStorage.setItem(
			toScopedStorageKey(STORAGE_NOTIFIED_POST_IDS_KEY_PREFIX, userId),
			JSON.stringify(postIds),
		);
	} catch {
		// Ignore storage failures.
	}
};

const base64UrlToUint8Array = (value: string): Uint8Array => {
	const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
	const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
	const buffer = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(buffer).set(bytes);
	return buffer;
};

const getServiceWorkerRegistration =
	async (): Promise<ServiceWorkerRegistration | null> => {
		if (!("serviceWorker" in navigator)) {
			return null;
		}
		const current = await navigator.serviceWorker.getRegistration();
		if (current) {
			return current;
		}
		return navigator.serviceWorker.ready.catch(() => null);
	};

const ensurePushSubscription = async (): Promise<boolean> => {
	if (!("PushManager" in window)) {
		return false;
	}

	const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
	if (!vapidPublicKey) {
		return false;
	}

	const registration = await getServiceWorkerRegistration();
	if (!registration) {
		return false;
	}

	let subscription = await registration.pushManager.getSubscription();
	if (!subscription) {
		subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: toArrayBuffer(
				base64UrlToUint8Array(vapidPublicKey),
			),
		});
	}

	const json = subscription.toJSON();
	const requestBody = SetThreadReplyPushSubscriptionSchema.parse({
		active: true,
		subscription: {
			endpoint: subscription.endpoint,
			expirationTime: subscription.expirationTime ?? null,
			keys: {
				p256dh: json.keys?.p256dh ?? "",
				auth: json.keys?.auth ?? "",
			},
		},
	});

	const response = await fetch(
		"/threads/api/posts/setThreadReplyPushSubscription",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
			cache: "no-store",
		},
	);

	return response.ok;
};

type NotificationPayload = {
	title: string;
	body: string;
	url: string;
	tag: string;
};

async function pushLocalNotification(
	payload: NotificationPayload,
	registration: ServiceWorkerRegistration | null,
): Promise<void> {
	if (typeof window === "undefined" || !("Notification" in window)) {
		return;
	}
	if (Notification.permission !== "granted") {
		return;
	}

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

	new Notification(payload.title, {
		body: payload.body,
		tag: payload.tag,
	});
}

export function ThreadReplyNotificationWatcher() {
	const { user, isLoading } = useUser();
	const userId = typeof user?.id === "string" ? user.id : null;
	const isFetchingRef = useRef(false);
	const initializedUsersRef = useRef<Set<string>>(new Set());
	const subscribedUsersRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (
			typeof window === "undefined" ||
			!("Notification" in window) ||
			isLoading ||
			!userId
		) {
			return;
		}

		const poll = async () => {
			if (isFetchingRef.current) {
				return;
			}
			if (document.visibilityState === "hidden") {
				return;
			}
			if (Notification.permission !== "granted") {
				return;
			}

			isFetchingRef.current = true;

			try {
				if (!subscribedUsersRef.current.has(userId)) {
					const registered = await ensurePushSubscription();
					if (registered) {
						subscribedUsersRef.current.add(userId);
					}
				}

				const params = new URLSearchParams({ limit: "20" });
				const cursor = readCursor(userId);
				if (cursor) {
					params.set("cursorCreatedAt", String(cursor.createdAt));
					params.set("cursorPostId", String(cursor.postId));
				}

				const response = await fetch(
					`/threads/api/posts/getThreadReplyNotifications?${params.toString()}`,
					{
						method: "GET",
						cache: "no-store",
					},
				);

				if (response.status === 401 || !response.ok) {
					return;
				}

				const raw = await response.json();
				const parsed = ThreadReplyNotificationListSchema.parse(raw);
				const notifications = parsed.notifications;
				const isInitialFetch = !initializedUsersRef.current.has(userId);

				const notifiedPostIds = readNotifiedPostIds(userId);
				const notifiedPostIdSet = new Set(notifiedPostIds);

				if (!isInitialFetch && notifications.length > 0) {
					const registration = await getServiceWorkerRegistration();
					for (const notification of notifications) {
						if (notifiedPostIdSet.has(notification.postId)) {
							continue;
						}
						await pushLocalNotification(
							{
								title: `${notification.repliedBy.name} さんが返信しました`,
								body: `${notification.threadTitle} / ${notification.postExcerpt}`,
								url: `/threads/${notification.threadId}?postId=${notification.postId}`,
								tag: `reply:${notification.postId}`,
							},
							registration,
						);
					}
				}

				for (const notification of notifications) {
					notifiedPostIdSet.add(notification.postId);
				}
				const nextNotifiedPostIds = Array.from(notifiedPostIdSet).slice(
					-STORAGE_NOTIFIED_POST_IDS_MAX,
				);
				writeNotifiedPostIds(userId, nextNotifiedPostIds);

				const latestNotification = notifications[notifications.length - 1];
				if (latestNotification) {
					const createdAt = toEpochSeconds(latestNotification.createdAt);
					if (createdAt > 0) {
						writeCursor(userId, {
							createdAt,
							postId: latestNotification.postId,
						});
					}
				}

				initializedUsersRef.current.add(userId);
			} catch (_error) {
				// Ignore polling errors to keep UX unaffected.
			} finally {
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
	}, [isLoading, userId]);

	return null;
}
