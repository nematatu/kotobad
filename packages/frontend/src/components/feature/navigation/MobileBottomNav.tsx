"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Home, PencilLine } from "lucide-react";
import { Link } from "@/components/common/Link";
import CreateThreadDialog from "@/components/feature/header/component/createThreadDialog";

type Props = {
	tags: TagType[];
};

const MobileBottomNav = ({ tags }: Props) => {
	return (
		<nav
			aria-label="モバイルナビゲーション"
			className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur [@media(min-width:496px)]:hidden"
		>
			<div className="mx-auto flex max-w-6xl items-center px-6 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
				<Link
					href="/"
					className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
				>
					<Home className="h-5 w-5" />
					<span>ホーム</span>
				</Link>
				<CreateThreadDialog
					tags={tags}
					className="flex-1"
					trigger={
						<button
							type="button"
							className="flex w-full flex-col items-center justify-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
							aria-label="投稿作成"
						>
							<PencilLine className="h-5 w-5" />
							<span>投稿</span>
						</button>
					}
				/>
			</div>
		</nav>
	);
};

export default MobileBottomNav;
