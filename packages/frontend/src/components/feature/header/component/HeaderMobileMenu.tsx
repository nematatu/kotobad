"use client";

import { Menu } from "lucide-react";
import { Link } from "@/components/common/Link";
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
import type { HeaderNavLink } from "../headerNavLinks";

type Props = {
	links: HeaderNavLink[];
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
							<SheetClose key={item.name} asChild>
								<Link
									href={item.link}
									className="rounded-md px-3 py-2 hover:bg-slate-100"
								>
									<span>{item.name}</span>
									{item.label ?? null}
								</Link>
							</SheetClose>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default HeaderMobileMenu;
