"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import CreateThreadDialog from "@/components/feature/header/component/createThreadDialog";
import { MobileBottomTabs } from "./MobileBottomTabs";

type Props = {
	tags: TagType[];
};

const MobileBottomNav = ({ tags }: Props) => {
	const pathname = usePathname();
	const isThreadDetailPage = pathname.startsWith("/threads/");
	const shouldShowCreateThreadButton = !isThreadDetailPage;

	if (isThreadDetailPage) {
		return null;
	}

	return (
		<>
			<nav
				aria-label="モバイルナビゲーション"
				className="view-transition-static-bottom-nav fixed inset-x-0 bottom-6 z-50 [@media(min-width:496px)]:hidden"
			>
				<div className="mx-auto w-full px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
					<MobileBottomTabs />
				</div>
			</nav>
			{shouldShowCreateThreadButton ? (
				<CreateThreadDialog
					tags={tags}
					trigger={
						<button
							type="button"
							aria-label="スレッドを投稿する"
							className="route-transition-floating-action fixed bottom-30 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white shadow-lg [@media(min-width:496px)]:hidden"
						>
							<Plus size={24} />
						</button>
					}
				/>
			) : null}
		</>
	);
};

export default MobileBottomNav;
