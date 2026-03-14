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
	const centerCreateAction = shouldShowCreateThreadButton ? (
		<CreateThreadDialog
			tags={tags}
			className="h-full w-full"
			trigger={
				<button
					type="button"
					aria-label="スレッドを投稿する"
					className="route-transition-floating-action group inline-flex h-full min-h-[53px] w-full touch-manipulation select-none flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-blue-500/92 px-2 text-[9px] font-semibold leading-none text-white shadow-[0_12px_26px_-20px_rgba(37,99,235,1)] transition-[transform,filter,box-shadow] duration-120 ease-out active:translate-y-[1px] active:scale-[0.92] active:brightness-95 active:shadow-[0_6px_14px_-12px_rgba(37,99,235,1)] [@media(hover:hover)]:hover:brightness-110"
				>
					<Plus
						size={28}
						className="transition-transform duration-100 group-active:scale-90"
					/>
				</button>
			}
		/>
	) : undefined;

	return (
		<motion.nav
			layoutRoot
			aria-label="モバイルナビゲーション"
			className="view-transition-static-bottom-nav fixed inset-x-0 bottom-6 z-50 [@media(min-width:496px)]:hidden"
		>
			<div className="mx-auto w-full px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
				<MobileBottomTabs centerAction={centerCreateAction} />
			</div>
		</motion.nav>
	);
};

export default MobileBottomNav;
