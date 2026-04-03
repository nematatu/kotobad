"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import ActionLink from "@/components/common/button/ActionLink";
import ThemeToggle from "@/components/feature/theme/ThemeToggle";
import { UserPopover } from "@/components/feature/user/popover/UserPopover";
import UserAvatar from "@/components/feature/user/UserAvatar";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "../../provider/UserProvider";

type Props = {
	links: ActionLinkItem[];
	isLoading: boolean;
};

const isActiveHref = (pathname: string, href: string) => {
	if (href === "/") {
		return pathname === "/";
	}

	if (href === "/threads") {
		return pathname === "/threads" || pathname.startsWith("/threads/");
	}

	return pathname === href || pathname.startsWith(`${href}/`);
};

const HeaderMobileMenu = ({ links, isLoading }: Props) => {
	const [open, setOpen] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);
	const pathname = usePathname();
	const { user } = useUser();
	const primaryLinks = links.filter(
		(item) => item.mobileMenuPlacement !== "bottom",
	);
	const secondaryLinks = links.filter(
		(item) => item.mobileMenuPlacement === "bottom",
	);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated || isLoading) {
		return (
			<div className="md:hidden" aria-hidden="true">
				<div className="size-8 rounded-full bg-gray-200 animate-pulse sm:size-10 dark:bg-slate-800" />
			</div>
		);
	}

	const profileHref = user?.id
		? `/users/${encodeURIComponent(user.id)}`
		: "/threads";
	const isProfileActive = isActiveHref(pathname, profileHref);
	const activeMenuClass =
		"bg-[#5A86FF]/12 text-[#5A86FF] [@media(hover:hover)]:hover:!bg-[#5A86FF]/18 [@media(hover:hover)]:hover:!text-[#5A86FF] dark:bg-[#5A86FF]/22 dark:[@media(hover:hover)]:hover:!bg-[#5A86FF]/26";

	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label="メニューを開く"
						className="relative size-8 rounded-full bg-transparent p-0 sm:size-10"
					>
						<UserAvatar />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex w-72 flex-col">
					<SheetTitle></SheetTitle>
					<div className="self-start">
						<UserPopover />
					</div>
					<div className="mt-4 flex w-full flex-col border-b border-slate-200 pb-3 dark:border-slate-800">
						<ActionLink
							variant="menu"
							onClick={() => setOpen(false)}
							className={isProfileActive ? activeMenuClass : undefined}
							item={{ href: profileHref, label: "プロフィールへ" }}
						/>
					</div>
					<nav className="mt-4 flex w-full flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
						{primaryLinks.map((item) => {
							const isActive = isActiveHref(pathname, item.href);

							return (
								<SheetClose key={item.href} asChild>
									<ActionLink
										item={item}
										variant="menu"
										className={isActive ? activeMenuClass : undefined}
									/>
								</SheetClose>
							);
						})}
					</nav>
					<div className="mt-auto w-full border-t border-slate-200 pt-4 dark:border-slate-800">
						{secondaryLinks.length > 0 ? (
							<nav className="flex w-full flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
								{secondaryLinks.map((item) => {
									const isActive = isActiveHref(pathname, item.href);

									return (
										<SheetClose key={item.href} asChild>
											<ActionLink
												item={item}
												variant="menu"
												className={isActive ? activeMenuClass : undefined}
											/>
										</SheetClose>
									);
								})}
							</nav>
						) : null}
						<div className="mt-4 flex justify-end">
							<ThemeToggle />
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default HeaderMobileMenu;
