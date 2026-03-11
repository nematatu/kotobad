"use client";

import { useEffect } from "react";
import { NotificationPanel } from "@/components/feature/header/component/notification/NotificationPanel";
import { useNotifications } from "@/components/feature/header/component/notification/useNotifications";
import { Switch } from "@/components/ui/switch";

export default function NotificationsPage() {
	const {
		notificationList,
		isNotificationsMuted,
		setNotificationsEnabled,
		markAllAsRead,
	} = useNotifications(true);

	useEffect(() => {
		void markAllAsRead();
	}, [markAllAsRead]);

	return (
		<div className="mx-auto flex min-h-full w-full max-w-5xl flex-col space-y-3 px-3 pt-5 md:px-0">
			<div className="flex w-full items-center justify-between gap-4">
				<h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">
					通知
				</h1>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setNotificationsEnabled(isNotificationsMuted)}
						className="text-left"
					>
						<p className="text-sm font-medium text-slate-950 dark:text-slate-50">
							通知を受け取る
						</p>
					</button>
					<Switch
						checked={!isNotificationsMuted}
						onCheckedChange={setNotificationsEnabled}
						aria-label="通知を受け取る"
						className="data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400"
					/>
				</div>
			</div>
			<div className="w-full">
				<section>
					<NotificationPanel
						notificationList={notificationList}
						isNotificationsEnabled={!isNotificationsMuted}
						showHeader={false}
						bodyClassName="p-0"
					/>
				</section>
			</div>
		</div>
	);
}
