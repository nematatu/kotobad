"use client";

import { Bell } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

export function NotificationBell() {
	const { data, mutate } = useSWR("notification-count", async () => {
		const url = await getBffApiUrl("GET_NOTIFICATIONS_COUNT");
		return BffFetcher<{ count: number }>(url);
	});

	return (
		<Popover
			onOpenChange={async (open) => {
				if (!open || !data?.count) return;
				const url = await getBffApiUrl("READ_ALL_NOTIFICATIONS");
				await BffFetcher(url, { method: "POST" });
				void mutate({ count: 0 }, false);
			}}
		>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="size-5" />
					{data?.count ? (
						<span
							className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1
  text-center text-[11px] font-bold text-white"
						>
							{data.count}
						</span>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">通知一覧</PopoverContent>
		</Popover>
	);
}
