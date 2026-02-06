"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { type AnimationEvent, type MouseEvent, useRef, useState } from "react";
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

const HeaderMobileMenu = ({ links, tags, user, isLoading }: Props) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const pendingHrefRef = useRef<string | null>(null);

	const handleMenuLinkClick =
		(href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			router.prefetch(href);
			pendingHrefRef.current = href;
			setOpen(false);
		};

	const handleContentAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
		if (open || event.target !== event.currentTarget) {
			return;
		}

		const nextHref = pendingHrefRef.current;
		if (!nextHref) {
			return;
		}

		pendingHrefRef.current = null;
		router.push(nextHref);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (nextOpen) {
			pendingHrefRef.current = null;
		}
	};

	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={handleOpenChange}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon">
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className="w-72 data-[state=closed]:duration-75"
					onAnimationEnd={handleContentAnimationEnd}
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
