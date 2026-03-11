"use client";

import type { NotificationList } from "@kotobad/shared/src/types/notifications";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { Bell, BellOff } from "lucide-react";
import { Link } from "@/components/common/Link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NOTIFICATION_PANEL_MIN_HEIGHT_CLASS = "min-h-[320px]";

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
	if (item.type === "thread_reply" || item.type === "post_reply") {
		return item.message;
	}

	return null;
};

type Props = {
	notificationList: NotificationList;
	isNotificationsEnabled: boolean;
	onItemNavigateAction?: () => void;
	showHeader?: boolean;
	bodyClassName?: string;
};

export function NotificationPanel({
	notificationList,
	isNotificationsEnabled,
	onItemNavigateAction,
	showHeader = true,
	bodyClassName,
}: Props) {
	return (
		<>
			{showHeader ? (
				<div className="border-b px-4 py-3">
					<p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
						通知
					</p>
				</div>
			) : null}
			<div className={cn("p-2", bodyClassName)}>
				{notificationList.length > 0 ? (
					notificationList.map((item) => (
						<Link
							key={item.id}
							href={item.href}
							onNavigate={() => onItemNavigateAction?.()}
							className="flex items-start gap-3 border-b border-slate-200/80 px-0 py-4 transition-colors last:border-b-0 [@media(hover:hover)]:hover:bg-slate-50 dark:border-slate-800 dark:[@media(hover:hover)]:hover:bg-slate-900"
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
				) : isNotificationsEnabled ? (
					<div
						className={`flex ${NOTIFICATION_PANEL_MIN_HEIGHT_CLASS} flex-col items-center justify-center gap-3 px-3 text-center text-sm text-slate-500 dark:text-slate-400`}
					>
						<Bell className="size-10 text-slate-300 dark:text-slate-700" />
						通知はまだありません
					</div>
				) : (
					<div
						className={`flex ${NOTIFICATION_PANEL_MIN_HEIGHT_CLASS} flex-col items-center justify-center gap-3 px-3 text-center text-sm text-slate-500 dark:text-slate-400`}
					>
						<BellOff className="size-10 text-slate-300 dark:text-slate-700" />
						通知を受け取らない設定です
					</div>
				)}
			</div>
		</>
	);
}
