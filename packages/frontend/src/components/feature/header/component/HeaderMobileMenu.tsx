"use client";

import { useState } from "react";
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

const HeaderMobileMenu = ({ links, isLoading }: Props) => {
	const [open, setOpen] = useState(false);
	const { user } = useUser();
	const primaryLinks = links.filter(
		(item) => item.mobileMenuPlacement !== "bottom",
	);
	const secondaryLinks = links.filter(
		(item) => item.mobileMenuPlacement === "bottom",
	);

	if (isLoading) {
		return (
			<div
				className="h-8 w-24 rounded-md bg-gray-200 animate-pulse dark:bg-slate-800"
				aria-hidden="true"
			/>
		);
	}

	const profileHref = user?.id
		? `/users/${encodeURIComponent(user.id)}`
		: "/threads";

	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						enableClickAnimation
						variant="ghost"
						size="icon"
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
							item={{ href: profileHref, label: "プロフィールへ" }}
						/>
					</div>
					<nav className="mt-4 flex w-full flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
						{primaryLinks.map((item) => (
							<SheetClose key={item.href} asChild>
								<ActionLink item={item} variant="menu" />
							</SheetClose>
						))}
					</nav>
					<div className="mt-auto w-full border-t border-slate-200 pt-4 dark:border-slate-800">
						{secondaryLinks.length > 0 ? (
							<nav className="flex w-full flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
								{secondaryLinks.map((item) => (
									<SheetClose key={item.href} asChild>
										<ActionLink item={item} variant="menu" />
									</SheetClose>
								))}
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
