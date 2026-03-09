"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Home, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/components/common/Link";
import CreateThreadDialog from "@/components/feature/header/component/createThreadDialog";
import { viewTransitionKeys } from "@/config/viewTransition";

type Props = {
	tags: TagType[];
};

const MobileBottomNav = ({ tags }: Props) => {
	const pathname = usePathname();
	const shouldShowCreateThreadButton = !pathname.startsWith("/threads/");

	return (
		<nav
			aria-label="モバイルナビゲーション"
			className="view-transition-static-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur [@media(min-width:496px)]:hidden"
		>
			<div className="mx-auto flex max-w-6xl items-center px-6 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
				<Link
					href="/threads"
					viewTransitionKey={viewTransitionKeys.threadListNavigation}
					className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
				>
					<Home className="h-5 w-5" />
					<span>スレッド一覧</span>
				</Link>
			</div>
			{shouldShowCreateThreadButton ? (
				<CreateThreadDialog
					tags={tags}
					trigger={
						<button
							type="button"
							aria-label="スレッドを投稿する"
							className="fixed bottom-20 right-4 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white shadow-lg"
						>
							<Plus size={24} />
						</button>
					}
				/>
			) : null}
		</nav>
	);
};

export default MobileBottomNav;
