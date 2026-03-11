"use client";

import type { NotificationList } from "@kotobad/shared/src/types/notifications";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

const NOTIFICATION_MUTE_STORAGE_KEY = "kotobad:notifications-muted";

export function useNotifications(fetchList: boolean) {
	const [isNotificationsMuted, setIsNotificationsMuted] = useState(false);
	const [cachedNotificationList, setCachedNotificationList] =
		useState<NotificationList>([]);

	const setNotificationsEnabled = useCallback((nextValue: boolean) => {
		const nextMuted = !nextValue;
		setIsNotificationsMuted(nextMuted);
		window.localStorage.setItem(
			NOTIFICATION_MUTE_STORAGE_KEY,
			String(nextMuted),
		);
	}, []);

	const { data: countData, mutate: mutateCount } = useSWR(
		"notification-count",
		async () => {
			const url = await getBffApiUrl("GET_NOTIFICATIONS_COUNT");
			return BffFetcher<{ count: number }>(url);
		},
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		},
	);

	const { data: notificationList } = useSWR<NotificationList>(
		fetchList ? "notifications" : null,
		async () => {
			const url = await getBffApiUrl("GET_NOTIFICATIONS");
			return BffFetcher<NotificationList>(url);
		},
		{
			keepPreviousData: true,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
			dedupingInterval: 30_000,
		},
	);

	useEffect(() => {
		const storedValue = window.localStorage.getItem(
			NOTIFICATION_MUTE_STORAGE_KEY,
		);
		setIsNotificationsMuted(storedValue === "true");
	}, []);

	useEffect(() => {
		if (!notificationList) {
			return;
		}

		setCachedNotificationList(notificationList);
	}, [notificationList]);

	const markAllAsRead = useCallback(async () => {
		if (!countData?.count || isNotificationsMuted) {
			return;
		}

		const url = await getBffApiUrl("READ_ALL_NOTIFICATIONS");
		await BffFetcher(url, { method: "POST" });
		void mutateCount({ count: 0 }, false);
	}, [countData?.count, isNotificationsMuted, mutateCount]);

	return {
		unreadCount: countData?.count ?? 0,
		notificationList: isNotificationsMuted
			? []
			: (notificationList ?? cachedNotificationList),
		isNotificationsMuted,
		setNotificationsEnabled,
		markAllAsRead,
	};
}
