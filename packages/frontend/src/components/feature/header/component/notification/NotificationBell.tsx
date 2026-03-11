"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/common/Link";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { NotificationPanel } from "./NotificationPanel";
import { useNotifications } from "./useNotifications";

export function NotificationBell() {
	const [open, setOpen] = useState(false);
	const {
		unreadCount,
		notificationList,
		isNotificationsMuted,
		setNotificationsEnabled,
		markAllAsRead,
	} = useNotifications(open);
	const triggerClassName =
		"relative text-slate-600 [@media(hover:hover)]:hover:text-slate-900 dark:text-slate-300 dark:[@media(hover:hover)]:hover:text-white";

	return (
		<>
			<div className="md:hidden">
				<Link
					href="/notifications"
					aria-label="通知ページへ移動"
					className={`relative inline-flex h-9 w-9 items-center justify-center rounded-md ${triggerClassName}`}
				>
					<Bell className="size-5" />
					{!isNotificationsMuted && unreadCount ? (
						<span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[11px] font-bold text-white">
							{unreadCount}
						</span>
					) : null}
				</Link>
			</div>
			<div className="hidden md:block">
				<Popover
					open={open}
					onOpenChange={async (nextOpen) => {
						setOpen(nextOpen);
						if (!nextOpen) {
							return;
						}
						await markAllAsRead();
					}}
				>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon" className={triggerClassName}>
							<Bell className="size-5" />
							{!isNotificationsMuted && unreadCount ? (
								<span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[11px] font-bold text-white">
									{unreadCount}
								</span>
							) : null}
						</Button>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-90 p-0">
						<NotificationPanel
							notificationList={notificationList}
							isNotificationsEnabled={!isNotificationsMuted}
							onItemNavigateAction={() => setOpen(false)}
							bodyClassName="max-h-[420px] overflow-y-auto p-2"
						/>
						<div className="flex items-center justify-between border-t px-4 py-3">
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
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
}
