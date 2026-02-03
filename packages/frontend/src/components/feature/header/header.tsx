"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Menu } from "lucide-react";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import { Link } from "@/components/common/Link";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import { UserPopover } from "@/components/feature/user/popover/UserPopover";
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
import { useUser } from "../provider/UserProvider";
import CreateThreadDialog from "./component/createThreadDialog";
import { headerNavLinks } from "./headerNavLinks";

type Props = {
	tags: TagType[];
};

const Header = ({ tags }: Props) => {
	const { user, isLoading } = useUser();

	return (
		<div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
			<div className="mx-auto flex max-w-6xl flex-col px-5">
				<div className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 [@media(min-width:496px)]:flex [@media(min-width:496px)]:gap-6">
					<div className="flex items-center justify-self-start [@media(min-width:496px)]:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-72">
								<SheetHeader>
									<SheetTitle>メニュー</SheetTitle>
									<SheetDescription className="sr-only">
										ナビゲーションメニュー
									</SheetDescription>
								</SheetHeader>
								<nav className="mt-4 flex flex-col gap-1 text-sm font-semibold text-slate-700">
									{headerNavLinks.map((item) => (
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
					<Link
						href="/"
						className="group col-start-2 flex items-center justify-center gap-2 justify-self-center px-4 py-3 shrink-0 [@media(min-width:496px)]:col-auto [@media(min-width:496px)]:justify-self-auto"
					>
						<span className="inline-flex transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 motion-reduce:group-hover:[animation:none]">
							<LogoIcon className="w-8" />
						</span>
						<LogoMojiIcon className="w-24 text-gray-800" />
					</Link>
					<nav className="hidden flex-1 items-center justify-end gap-4 text-xs font-semibold text-slate-600 [@media(min-width:496px)]:flex md:text-sm">
						{headerNavLinks.map((item) => (
							<Link
								key={item.name}
								href={item.link}
								className="flex items-center rounded-lg gap-2 px-3 py-2 transition hover:bg-gray-100"
							>
								<span>{item.name}</span>
								{item.label ?? null}
							</Link>
						))}
					</nav>
					<div className="flex items-center justify-self-end space-x-2 [@media(min-width:496px)]:ml-auto">
						{isLoading ? (
							<div
								className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"
								aria-hidden="true"
							/>
						) : user ? (
							<>
								<div className="hidden md:flex">
									<CreateThreadDialog tags={tags} />
								</div>
								<div className="flex md:hidden">
									<UserPopover />
								</div>
							</>
						) : (
							<GoogleOAuth />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
