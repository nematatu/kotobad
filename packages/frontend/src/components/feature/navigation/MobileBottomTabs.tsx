"use client";

import { Home, MessageSquareText, Search, User } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useUser } from "@/components/feature/provider/UserProvider";

type BottomTab = {
	id: string;
	label: string;
	href: string;
	icon: ReactNode;
	isActive: boolean;
};

const isProfilePath = (pathname: string) =>
	pathname.startsWith("/account") ||
	pathname.startsWith("/auth") ||
	pathname.startsWith("/users/");

export function MobileBottomTabs() {
	const pathname = usePathname();
	const { user } = useUser();
	const profileHref = user?.id
		? `/users/${encodeURIComponent(user.id)}`
		: "/auth/sign-in";

	const tabs: BottomTab[] = [
		{
			id: "home",
			label: "ホーム",
			href: "/",
			icon: <Home className="h-5 w-5" />,
			isActive: pathname === "/",
		},
		{
			id: "threads",
			label: "スレッド",
			href: "/threads",
			icon: <MessageSquareText className="h-5 w-5" />,
			isActive: pathname === "/threads",
		},
		{
			id: "search",
			label: "検索",
			href: "/search",
			icon: <Search className="h-5 w-5" />,
			isActive: pathname === "/search",
		},
		{
			id: "profile",
			label: "プロフィール",
			href: profileHref,
			icon: <User className="h-5 w-5" />,
			isActive: isProfilePath(pathname),
		},
	];

	const activeTabId = tabs.find((tab) => tab.isActive)?.id;

	return (
		<div className="w-full rounded-[1.4rem] border border-slate-200/90 bg-white/90 p-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
			<LayoutGroup id="mobile-bottom-tabs">
				<div className="flex w-full items-stretch gap-1">
					{tabs.map((tab) => (
						<NextLink
							key={tab.id}
							href={tab.href}
							data-checked={activeTabId === tab.id ? "true" : "false"}
							aria-label={tab.label}
							className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[11px] font-semibold leading-none text-slate-500 transition-colors duration-150 [@media(hover:hover)]:hover:text-slate-900 data-[checked=true]:text-slate-950"
						>
							{activeTabId === tab.id ? (
								<motion.div
									layoutId="mobile-bottom-tabs-active"
									className="absolute inset-0 z-0 rounded-[1rem] bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
									transition={{
										type: "spring",
										bounce: 0.22,
										duration: 0.42,
									}}
								/>
							) : null}
							<span className="relative z-10 flex h-5 items-center justify-center">
								{tab.icon}
							</span>
							<span className="relative z-10 truncate">{tab.label}</span>
						</NextLink>
					))}
				</div>
			</LayoutGroup>
		</div>
	);
}
