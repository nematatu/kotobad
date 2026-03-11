"use client";

import type { NotificationList } from "@kotobad/shared/src/types/notifications";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
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

const getNotificationSummary = (item: NotificationList[number]) => {
	switch (item.type) {
		case "thread_reply":
			return "あなたの投稿に返信しました";
		case "post_reply":
			return "あなたに返信しました";
		case "thread_like":
			return "あなたの投稿にいいねしました";
		case "post_reaction":
			return "あなたの返信にリアクションしました";
	}
};

const getNotificationPreview = (item: NotificationList[number]) => {
	if (
		item.type === "thread_reply" ||
		item.type === "post_reply" ||
		item.type === "thread_like"
	) {
		return item.message;
	}

	return null;
};

export function NotificationBell() {
	const [open, setOpen] = useState(false);
	const [cachedNotificationList, setCachedNotificationList] =
		useState<NotificationList>([]);
	const { data, mutate } = useSWR("notification-count", async () => {
		const url = await getBffApiUrl("GET_NOTIFICATIONS_COUNT");
		return BffFetcher<{ count: number }>(url);
	});
	const { data: notificationList, isLoading: isNotificationsLoading } =
		useSWR<NotificationList>(open ? "notifications" : null, async () => {
			const url = await getBffApiUrl("GET_NOTIFICATIONS");
			return BffFetcher<NotificationList>(url);
		});

	useEffect(() => {
		if (!notificationList) {
			return;
		}

		setCachedNotificationList(notificationList);
	}, [notificationList]);

	const visibleNotificationList = notificationList ?? cachedNotificationList;

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
					{visibleNotificationList.length > 0 ? (
						visibleNotificationList.map((item) => (
							<Link
								key={item.id}
								href={item.href}
								onNavigate={() => setOpen(false)}
								className="flex items-start gap-3 rounded-2xl px-3 py-3.5 transition-colors [@media(hover:hover)]:hover:bg-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-900"
							>
								<Avatar className="size-10">
									<AvatarImage src={item.sender.image ?? undefined} />
									<AvatarFallback className="text-xs">
										{item.sender.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1 space-y-1.5">
									<p className="line-clamp-2 text-[13.5px] leading-5 text-slate-700 dark:text-slate-200">
										<span className="font-semibold text-slate-950 dark:text-slate-50">
											{item.sender.name}
										</span>
										<span> が </span>
										<span>{getNotificationSummary(item)}</span>
									</p>
									{getNotificationPreview(item) ? (
										<p className="line-clamp-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
											{getNotificationPreview(item)}
										</p>
									) : null}
									<time className="block text-[12px] text-slate-400 dark:text-slate-500">
										{getRelativeDate(item.createdAt)}
									</time>
								</div>
							</Link>
						))
					) : isNotificationsLoading ? null : (
						<div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
							通知はまだありません
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
