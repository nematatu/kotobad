"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Menu } from "lucide-react";
import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import ActionLink from "@/components/common/button/ActionLink";
import type { UserState } from "@/components/feature/provider/UserProvider";
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
import HeaderUserActions from "./HeaderUserActions";

type Props = {
	links: ActionLinkItem[];
	tags: TagType[];
	user: UserState;
	isLoading: boolean;
};

const HeaderMobileMenu = ({ links, tags, user, isLoading }: Props) => {
	return (
		<div className="md:hidden">
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
