"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DEMO_NOTIFICATION_TAG = "kotobad-notification-demo";

async function triggerDemoNotification() {
	if (typeof window === "undefined") {
		return;
	}

	if (!("Notification" in window)) {
		toast.error("このブラウザは通知に対応していません");
		return;
	}

	let permission = Notification.permission;
	if (permission === "default") {
		permission = await Notification.requestPermission();
	}

	if (permission !== "granted") {
		toast.error("通知が許可されていません");
		return;
	}

	const title = "kotobad 通知デモ";
	const body = "PWA通知のデモです。タップでスレッド一覧を開きます。";

	try {
		if ("serviceWorker" in navigator) {
			const registration =
				(await navigator.serviceWorker.getRegistration()) ??
				(await navigator.serviceWorker.ready.catch(() => null));

			if (registration) {
				await registration.showNotification(title, {
					body,
					tag: DEMO_NOTIFICATION_TAG,
					icon: "/pwa-192x192.png",
					badge: "/pwa-192x192.png",
					data: { url: "/threads" },
				});
				toast.success("通知を送信しました");
				return;
			}
		}

		new Notification(title, { body, tag: DEMO_NOTIFICATION_TAG });
		toast.success("通知を送信しました");
	} catch {
		toast.error("通知の送信に失敗しました");
	}
}

export function NotificationDemoButton() {
	return (
		<Button
			type="button"
			variant="outline"
			rounded="full"
			className="inline-flex h-8 items-center gap-1.5 px-3 text-xs"
			onClick={() => {
				void triggerDemoNotification();
			}}
		>
			<Bell className="h-3.5 w-3.5" />
			<span>通知デモ</span>
		</Button>
	);
}
