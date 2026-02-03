"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import { Link } from "@/components/common/Link";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import CreateThreadButton from "../button/thread/createThread";
import { useUser } from "../provider/UserProvider";
import { UserPopover } from "../user/popover/UserPopover";
import { headerNavLinks } from "./headerNavLinks";

type Props = {
	tags: TagType[];
};

const Header = ({ tags }: Props) => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
				<Link href="/" className="flex items-center gap-2 shrink-0">
					<LogoIcon className="w-8" />
					<LogoMojiIcon className="w-24 text-gray-800" />
				</Link>
				<nav className="hidden flex-1 items-center justify-end gap-6 text-xs md:text-sm font-semibold text-slate-600 md:flex">
					{headerNavLinks.map((item) => (
						<Link
							key={item.name}
							href={item.link}
							className="flex items-center gap-2 transition hover:text-slate-900"
						>
							<span>{item.name}</span>
							{item.label ?? null}
						</Link>
					))}
				</nav>
				<div className="ml-auto flex items-center space-x-2">
					{isLoading ? (
						<div
							className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"
							aria-hidden="true"
						/>
					) : user ? (
						<div className="flex items-center space-x-4">
							<UserPopover />
							<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
								<DialogTrigger asChild>
									<CreateThreadButton />
								</DialogTrigger>
								<DialogContent className="" position={"tc"} size={"xl"}>
									<div className="p-4 pb-0">
										<DialogTitle>
											<header className="flex items-center gap-3">
												<div>
													<h2
														id="create-thread-title"
														className="text-base font-semibold text-slate-900"
													>
														新規スレッドを作成
													</h2>
													<p className="text-xs text-slate-500">
														今の気持ちや話題をシェアしましょう
													</p>
												</div>
											</header>
										</DialogTitle>
									</div>
									<CreateThreadForm
										onCreated={() => {
											router.refresh();
											setIsCreateOpen(false);
										}}
										initialTags={tags}
									/>
								</DialogContent>
							</Dialog>
						</div>
					) : (
						<GoogleOAuth />
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
