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
import { motion } from "motion/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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

const isThreadPath = (pathname: string) =>
	pathname === "/threads" || /^\/threads\/[^/]+$/.test(pathname);

type IndicatorRect = {
	height: number;
	width: number;
	x: number;
	y: number;
};

const indicatorTransition = {
	type: "spring" as const,
	bounce: 0.22,
	duration: 0.42,
};

type MobileBottomTabsProps = {
	centerAction?: React.ReactNode;
	isCenterActionOpen?: boolean;
};

export function MobileBottomTabs({
	centerAction,
	isCenterActionOpen = false,
}: MobileBottomTabsProps) {
	const pathname = usePathname();
	const { user } = useUser();
	const [optimisticActiveTabId, setOptimisticActiveTabId] = useState<
		string | null
	>(null);
	const [pressedTabId, setPressedTabId] = useState<string | null>(null);
	const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(
		null,
	);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
	const profileHref = user?.id
		? `/users/${encodeURIComponent(user.id)}`
		: "/auth/sign-in";

	const tabs = useMemo<BottomTab[]>(
		() => [
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
				isActive: isThreadPath(pathname),
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
		],
		[pathname, profileHref],
	);

	const routeActiveTabId = tabs.find((tab) => tab.isActive)?.id ?? null;
	const activeTabId = optimisticActiveTabId ?? routeActiveTabId;

	useEffect(() => {
		if (pathname) {
			setOptimisticActiveTabId(null);
		}
	}, [pathname]);

	useEffect(() => {
		const handlePointerUp = () => {
			setPressedTabId(null);
		};

		window.addEventListener("pointerup", handlePointerUp);
		window.addEventListener("pointercancel", handlePointerUp);

		return () => {
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointercancel", handlePointerUp);
		};
	}, []);

	const updateIndicatorRect = useCallback(() => {
		const containerElement = containerRef.current;
		if (!containerElement || !activeTabId) {
			setIndicatorRect((current) => (current === null ? current : null));
			return;
		}

		const activeTabElement = tabRefs.current[activeTabId];
		if (!activeTabElement) {
			setIndicatorRect((current) => (current === null ? current : null));
			return;
		}

		const containerRect = containerElement.getBoundingClientRect();
		const activeTabRect = activeTabElement.getBoundingClientRect();
		const next = {
			height: activeTabRect.height,
			width: activeTabRect.width,
			x: activeTabRect.left - containerRect.left,
			y: activeTabRect.top - containerRect.top,
		};

		setIndicatorRect((current) => {
			if (
				current &&
				current.height === next.height &&
				current.width === next.width &&
				current.x === next.x &&
				current.y === next.y
			) {
				return current;
			}
			return next;
		});
	}, [activeTabId]);

	useLayoutEffect(() => {
		updateIndicatorRect();
	}, [updateIndicatorRect]);

	useEffect(() => {
		window.addEventListener("resize", updateIndicatorRect);
		return () => {
			window.removeEventListener("resize", updateIndicatorRect);
		};
	}, [updateIndicatorRect]);

	const renderTab = (tab: BottomTab) => {
		const isActive = activeTabId === tab.id;

		return (
			<NextLink
				key={tab.id}
				href={tab.href}
				ref={(node) => {
					tabRefs.current[tab.id] = node;
				}}
				data-checked={isActive ? "true" : "false"}
				aria-label={tab.label}
				onClick={() => {
					setOptimisticActiveTabId(tab.id);
				}}
				onPointerDown={() => {
					setPressedTabId(tab.id);
				}}
				className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-[1rem] px-2 py-2 text-[9px] font-semibold leading-none text-slate-500 transition-[color,transform,opacity] duration-150 ease-out active:scale-[0.94] [@media(hover:hover)]:hover:text-slate-900 data-[checked=true]:text-slate-950 dark:text-slate-400 dark:[@media(hover:hover)]:hover:text-slate-100 dark:data-[checked=true]:text-slate-50 ${
					isCenterActionOpen ? "opacity-0 pointer-events-none" : "opacity-100"
				}`}
			>
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
				<span className="sr-only">{tab.label}</span>
			</NextLink>
		);
	};

	const leadingTabs = tabs.slice(0, 2);
	const trailingTabs = tabs.slice(2);

	return (
		<div
			className={`w-full rounded-[1.4rem] ${
				isCenterActionOpen
					? "bg-transparent p-0 shadow-none backdrop-blur-0"
					: "bg-white/92 p-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur dark:bg-slate-950/92 dark:shadow-[0_18px_40px_-28px_rgba(2,6,23,0.95)]"
			}`}
		>
			<div
				ref={containerRef}
				className="relative flex w-full items-stretch gap-1"
			>
				{indicatorRect && !isCenterActionOpen ? (
					<motion.div
						initial={false}
						animate={{
							height: indicatorRect.height,
							scale: pressedTabId === activeTabId ? 0.94 : 1,
							width: indicatorRect.width,
							x: indicatorRect.x,
							y: indicatorRect.y,
						}}
						className="absolute z-0 rounded-[1rem] bg-slate-200/90 dark:bg-slate-800/90"
						transition={indicatorTransition}
					/>
				) : null}
				{leadingTabs.map(renderTab)}
				{centerAction ? (
					<div className="relative z-10 flex min-w-0 flex-1 items-stretch px-0.5">
						{centerAction}
					</div>
				) : null}
				{trailingTabs.map(renderTab)}
			</div>
		</div>
	);
}
