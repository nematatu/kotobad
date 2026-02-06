"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import ActionLink from "@/components/common/button/ActionLink";
import type { UserState } from "@/components/feature/provider/UserProvider";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import HeaderUserActions from "./HeaderUserActions";

type Props = {
	links: ActionLinkItem[];
	tags: TagType[];
	user: UserState;
	isLoading: boolean;
};

const CLOSE_TO_NAV_DELAY_MS = 60;

const HeaderMobileMenu = ({ links, tags, user, isLoading }: Props) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [nextHref, setNextHref] = useState<string | null>(null);

	const handleMenuLinkClick =
		(href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			router.prefetch(href);
			setNextHref(href);
			setOpen(false);
		};

	useEffect(() => {
		if (open || !nextHref) {
			return;
		}

		const timer = window.setTimeout(() => {
			router.push(nextHref);
			setNextHref(null);
		}, CLOSE_TO_NAV_DELAY_MS);

		return () => window.clearTimeout(timer);
	}, [open, nextHref, router]);

	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon">
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-72 data-[state=closed]:duration-75"
				>
					<SheetHeader>
						<SheetTitle>メニュー</SheetTitle>
						<SheetDescription className="sr-only">
							ナビゲーションメニュー
						</SheetDescription>
					</SheetHeader>
					<div className="mt-4 border-b border-slate-200 pb-3">
						<HeaderUserActions
							isLoading={isLoading}
							user={user}
							tags={tags}
							showCreate={false}
						/>
					</div>
					<nav className="mt-4 flex flex-col gap-1 text-sm font-semibold text-slate-700">
						{links.map((item) => (
							<ActionLink
								key={item.href}
								item={item}
								variant="menu"
								onClick={handleMenuLinkClick(item.href)}
							/>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default HeaderMobileMenu;
