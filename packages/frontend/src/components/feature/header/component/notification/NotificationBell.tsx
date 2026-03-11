"use client";

import type { NotificationList } from "@kotobad/shared/src/types/notifications";
import { Bell } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Link } from "@/components/common/Link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

const formatNotificationDate = (value: string) =>
	new Intl.DateTimeFormat("ja-JP", {
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));

export function NotificationBell() {
	const [open, setOpen] = useState(false);
	const { data, mutate } = useSWR("notification-count", async () => {
		const url = await getBffApiUrl("GET_NOTIFICATIONS_COUNT");
		return BffFetcher<{ count: number }>(url);
	});
	const { data: notificationList } = useSWR<NotificationList>(
		open ? "notifications" : null,
		async () => {
			const url = await getBffApiUrl("GET_NOTIFICATIONS");
			return BffFetcher<NotificationList>(url);
		},
	);

	return (
		<Popover
			open={open}
			onOpenChange={async (nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen || !data?.count) return;
				const url = await getBffApiUrl("READ_ALL_NOTIFICATIONS");
				await BffFetcher(url, { method: "POST" });
				void mutate({ count: 0 }, false);
			}}
		>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="size-5" />
					{data?.count ? (
						<span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[11px] font-bold text-white">
							{data.count}
						</span>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-90 p-0">
				<div className="border-b px-4 py-3">
					<p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
						通知
					</p>
				</div>
				<div className="max-h-[420px] overflow-y-auto p-2">
					{notificationList && notificationList.length > 0 ? (
						notificationList.map((item) => (
							<Link
								key={item.id}
								href={item.href}
								onNavigate={() => setOpen(false)}
								className="flex items-start gap-3 rounded-xl px-3 py-3 [@media(hover:hover)]:hover:bg-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-900"
							>
								<Avatar className="size-8">
									<AvatarImage src={item.sender.image ?? undefined} />
									<AvatarFallback>{item.sender.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
											{item.sender.name}
										</p>
										<time className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
											{formatNotificationDate(item.createdAt)}
										</time>
									</div>
									<p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
										{item.message}
									</p>
								</div>
							</Link>
						))
					) : (
						<div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
							通知はまだありません
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
