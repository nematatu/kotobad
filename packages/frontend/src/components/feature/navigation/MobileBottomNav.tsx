"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreatePostForm } from "@/app/threads/[id]/components/CreatePostForm";
import { MobileBottomCreateThreadMorph } from "./MobileBottomCreateThreadMorph";
import { MobileBottomTabs } from "./MobileBottomTabs";

type Props = {
	tags: TagType[];
};

const MobileBottomNav = ({ tags }: Props) => {
	const pathname = usePathname();
	const [isCreateSurfaceOpen, setIsCreateSurfaceOpen] = useState(false);
	const threadDetailMatch = pathname.match(/^\/threads\/(\d+)$/);
	const threadId = threadDetailMatch ? Number(threadDetailMatch[1]) : null;
	const isThreadDetailPage = threadId !== null;
	const centerCreateAction = isThreadDetailPage ? undefined : (
		<MobileBottomCreateThreadMorph
			tags={tags}
			onOpenStateChange={setIsCreateSurfaceOpen}
		/>
	);

	return (
		<motion.nav
			layoutRoot
			aria-label="モバイルナビゲーション"
			className={`view-transition-static-bottom-nav fixed inset-x-0 bottom-6 [@media(min-width:496px)]:hidden ${
				isCreateSurfaceOpen ? "z-[110]" : "z-50"
			}`}
		>
			<div className="mx-auto w-full px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
				{isThreadDetailPage && threadId ? (
					<div className="w-full rounded-[1.4rem] bg-white/92 p-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur dark:bg-slate-950/92 dark:shadow-[0_18px_40px_-28px_rgba(2,6,23,0.95)]">
						<CreatePostForm threadId={threadId} variant="bottomNav" />
					</div>
				) : (
					<MobileBottomTabs
						centerAction={centerCreateAction}
						isCenterActionOpen={isCreateSurfaceOpen}
					/>
				)}
			</div>
		</motion.nav>
	);
};

export default MobileBottomNav;
