"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
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

	return (
		<>
			<motion.nav
				layoutRoot
				aria-label="モバイルナビゲーション"
				className="view-transition-static-bottom-nav fixed inset-x-0 bottom-6 z-50 [@media(min-width:496px)]:hidden"
			>
				<div className="mx-auto w-full px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
					<MobileBottomTabs />
				</div>
			</motion.nav>
			{shouldShowCreateThreadButton ? (
				<CreateThreadDialog
					tags={tags}
					trigger={
						<button
							type="button"
							aria-label="スレッドを投稿する"
							className="route-transition-floating-action fixed bottom-30 right-4 z-[70] inline-flex h-14 w-14 appearance-none items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white shadow-lg outline-none [-webkit-tap-highlight-color:transparent] focus:border-slate-200 focus:outline-none focus:ring-0 focus-visible:border-slate-200 focus-visible:outline-none focus-visible:ring-0 dark:border-slate-700 dark:bg-blue-500/95 dark:shadow-[0_18px_40px_-28px_rgba(2,6,23,0.95)] dark:focus:border-slate-700 dark:focus-visible:border-slate-700 [@media(min-width:496px)]:hidden"
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
