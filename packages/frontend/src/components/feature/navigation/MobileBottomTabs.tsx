"use client";

import type { Icon } from "@tabler/icons-react";
import {
	IconHome2,
	IconHome2Filled,
	IconMessage2,
	IconMessage2Filled,
	IconSearch,
	IconSearchFilled,
	IconUser,
	IconUserFilled,
} from "@tabler/icons-react";
import { LayoutGroup, motion } from "motion/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/components/feature/provider/UserProvider";

type BottomTab = {
	id: string;
	label: string;
	href: string;
	icon: {
		active: Icon;
		inactive: Icon;
	};
	isActive: boolean;
};

const isProfilePath = (pathname: string) =>
	pathname.startsWith("/account") ||
	pathname.startsWith("/auth") ||
	pathname.startsWith("/users/");

export function MobileBottomTabs() {
	const pathname = usePathname();
	const { user } = useUser();
	const [optimisticActiveTabId, setOptimisticActiveTabId] = useState<
		string | null
	>(null);
	const profileHref = user?.id
		? `/users/${encodeURIComponent(user.id)}`
		: "/auth/sign-in";

	const tabs: BottomTab[] = [
		{
			id: "home",
			label: "ホーム",
			href: "/",
			icon: {
				active: IconHome2Filled,
				inactive: IconHome2,
			},
			isActive: pathname === "/",
		},
		{
			id: "search",
			label: "検索",
			href: "/search",
			icon: {
				active: IconSearchFilled,
				inactive: IconSearch,
			},
			isActive: pathname === "/search",
		},
		{
			id: "threads",
			label: "スレッド",
			href: "/threads",
			icon: {
				active: IconMessage2Filled,
				inactive: IconMessage2,
			},
			isActive: pathname === "/threads",
		},
		{
			id: "profile",
			label: "プロフィール",
			href: profileHref,
			icon: {
				active: IconUserFilled,
				inactive: IconUser,
			},
			isActive: isProfilePath(pathname),
		},
	];

	const routeActiveTabId = tabs.find((tab) => tab.isActive)?.id ?? null;
	const activeTabId = optimisticActiveTabId ?? routeActiveTabId;

	useEffect(() => {
		if (pathname) {
			setOptimisticActiveTabId(null);
		}
	}, [pathname]);

	return (
		<div className="w-full rounded-[1.4rem] bg-white/92 p-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
			<LayoutGroup id="mobile-bottom-tabs">
				<div className="flex w-full items-stretch gap-1">
					{tabs.map((tab) => {
						const isActive = activeTabId === tab.id;

						return (
							<NextLink
								key={tab.id}
								href={tab.href}
								data-checked={isActive ? "true" : "false"}
								aria-label={tab.label}
								onClick={() => {
									setOptimisticActiveTabId(tab.id);
								}}
								className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-[1rem] px-2 py-2 text-[9px] font-semibold leading-none text-slate-500 transition-[color,transform] duration-150 ease-out active:scale-[0.94] [@media(hover:hover)]:hover:text-slate-900 data-[checked=true]:text-slate-950"
							>
								{isActive ? (
									<motion.div
										layoutId="mobile-bottom-tabs-active"
										className="absolute inset-0 z-0 rounded-[1rem] bg-slate-200/90"
										transition={{
											type: "spring",
											bounce: 0.22,
											duration: 0.42,
										}}
									/>
								) : null}
								<span
									className={`relative z-10 flex h-5 items-center justify-center transition-transform duration-150 ease-out ${
										isActive ? "scale-[1.16]" : "scale-100"
									}`}
								>
									{isActive ? (
										<tab.icon.active className="h-6 w-6" stroke={1.9} />
									) : (
										<tab.icon.inactive className="h-6 w-6" stroke={1.9} />
									)}
								</span>
								<span
									className={`relative z-10 inline-flex origin-center transition-transform duration-150 ease-out ${
										isActive ? "scale-[1.3]" : "scale-100"
									}`}
								>
									{tab.label}
								</span>
							</NextLink>
						);
					})}
				</div>
			</LayoutGroup>
		</div>
	);
}
