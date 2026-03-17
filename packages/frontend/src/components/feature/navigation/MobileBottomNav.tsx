"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileBottomCreateThreadMorph } from "./MobileBottomCreateThreadMorph";
import { MobileBottomTabs } from "./MobileBottomTabs";

type Props = {
	tags: TagType[];
};

const MobileBottomNav = ({ tags }: Props) => {
	const pathname = usePathname();
	const [isCreateSurfaceOpen, setIsCreateSurfaceOpen] = useState(false);
	const threadDetailMatch = pathname.match(/^\/threads\/(\d+)$/);
	const isThreadDetailPage = threadDetailMatch !== null;
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
			{!isThreadDetailPage ? (
				<div className="mx-auto w-full px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
					<MobileBottomTabs
						centerAction={centerCreateAction}
						isCenterActionOpen={isCreateSurfaceOpen}
					/>
				</div>
			) : null}
		</motion.nav>
	);
};

export default MobileBottomNav;
