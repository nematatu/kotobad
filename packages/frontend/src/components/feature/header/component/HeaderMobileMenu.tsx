"use client";

import { Menu } from "lucide-react";
import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import ActionLink from "@/components/common/button/ActionLink";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
	links: ActionLinkItem[];
};

const HeaderMobileMenu = ({ links }: Props) => {
	return (
		<div className="[@media(min-width:496px)]:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon">
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side="right" className="w-72">
					<SheetHeader>
						<SheetTitle>メニュー</SheetTitle>
						<SheetDescription className="sr-only">
							ナビゲーションメニュー
						</SheetDescription>
					</SheetHeader>
					<nav className="mt-4 flex flex-col gap-1 text-sm font-semibold text-slate-700">
						{links.map((item) => (
							<SheetClose key={item.href} asChild>
								<ActionLink item={item} variant="menu" />
							</SheetClose>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default HeaderMobileMenu;
