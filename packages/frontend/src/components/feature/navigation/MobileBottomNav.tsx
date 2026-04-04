"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileBottomCreateThreadOverlay } from "./MobileBottomCreateThreadOverlay";
import { MobileBottomTabs } from "./MobileBottomTabs";

type Props = {
	tags: TagType[];
};

const MobileBottomNav = ({ tags }: Props) => {
	const pathname = usePathname();
	const isSettingsPage = pathname.startsWith("/settings");
	const [isCreateSurfaceOpen, setIsCreateSurfaceOpen] = useState(false);
	const [isHiddenByScroll, setIsHiddenByScroll] = useState(false);
	const threadDetailMatch = pathname.match(/^\/threads\/(\d+)$/);
	const isThreadDetailPage = threadDetailMatch !== null;
	const shouldHideNavByScroll = !isCreateSurfaceOpen && isHiddenByScroll;
	const centerCreateAction = isThreadDetailPage ? undefined : (
		<MobileBottomCreateThreadOverlay
			tags={tags}
			onOpenStateChangeAction={setIsCreateSurfaceOpen}
		/>
	);

	useEffect(() => {
		if (isSettingsPage || isThreadDetailPage || isCreateSurfaceOpen) {
			setIsHiddenByScroll(false);
			return;
		}
		if (!window.matchMedia("(max-width: 495px)").matches) {
			setIsHiddenByScroll(false);
			return;
		}

		let lastScrollY = window.scrollY;
		const minDelta = 8;
		const topRevealThreshold = 20;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY <= topRevealThreshold) {
				setIsHiddenByScroll(false);
				lastScrollY = currentScrollY;
				return;
			}

			const delta = currentScrollY - lastScrollY;
			if (Math.abs(delta) < minDelta) {
				return;
			}

			if (delta > 0) {
				setIsHiddenByScroll(true);
			} else {
				setIsHiddenByScroll(false);
			}
			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isCreateSurfaceOpen, isSettingsPage, isThreadDetailPage]);

	if (isSettingsPage) {
		return null;
	}

	return (
		<motion.nav
			layoutRoot
			aria-label="モバイルナビゲーション"
			animate={{
				opacity: shouldHideNavByScroll ? 0.88 : 1,
				y: shouldHideNavByScroll ? "130%" : "0%",
			}}
			transition={{
				duration: 0.22,
				ease: [0.22, 1, 0.36, 1],
			}}
			className={`view-transition-static-bottom-nav fixed inset-x-0 bottom-6 [@media(min-width:496px)]:hidden ${
				isCreateSurfaceOpen ? "z-[110]" : "z-50"
			} ${shouldHideNavByScroll ? "pointer-events-none" : "pointer-events-auto"}`}
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
