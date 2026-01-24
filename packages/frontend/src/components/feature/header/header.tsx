"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
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

type Props = {
	tags: TagType[];
};

const Header = ({ tags }: Props) => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<div className="sticky top-0 z-50 w-full bg-gray-200">
			<div className="flex h-16 items-center justify-between max-w-4xl lg:max-w-6xl mx-auto px-5">
				<Link href="/">
					<div className="flex items-center space-x-2">
						<LogoMojiIcon className="w-24 text-gray-800" />
						<LogoIcon className="w-8" />
					</div>
				</Link>
				<div className="flex items-center space-x-2">
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
