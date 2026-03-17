"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { motion } from "motion/react";
import { Suspense, useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/feature/theme/ThemeToggle";
import { useUser } from "../provider/UserProvider";
import HeaderLogo from "./component/HeaderLogo";
import HeaderMobileMenu from "./component/HeaderMobileMenu";
import HeaderNav from "./component/HeaderNav";
import HeaderSearch from "./component/HeaderSearch";
import HeaderUserActions from "./component/HeaderUserActions";
import { headerNavLinks } from "./headerNavLinks";

type Props = {
	tags: TagType[];
};

const Header = ({ tags }: Props) => {
	const { user, isLoading } = useUser();
	const headerRef = useRef<HTMLDivElement>(null);
	const [isHiddenByScroll, setIsHiddenByScroll] = useState(false);

	useEffect(() => {
		const root = document.documentElement;
		const headerElement = headerRef.current;
		if (!headerElement) {
			return;
		}

		const setHeaderHeight = () => {
			const headerHeight = Math.ceil(
				headerElement.getBoundingClientRect().height,
			);
			root.style.setProperty("--header-height", `${headerHeight}px`);
		};

		setHeaderHeight();

		const resizeObserver = new ResizeObserver(setHeaderHeight);
		resizeObserver.observe(headerElement);

		return () => {
			resizeObserver.disconnect();
			root.style.removeProperty("--header-height");
		};
	}, []);

	useEffect(() => {
		if (!window.matchMedia("(max-width: 495px)").matches) {
			setIsHiddenByScroll(false);
			return;
		}

		let lastScrollY = window.scrollY;
		const minDelta = 8;
		const topRevealThreshold = 20;

		const handleScroll = () => {
			const currentScrollY = Math.max(0, window.scrollY);
			if (currentScrollY <= topRevealThreshold) {
				setIsHiddenByScroll(false);
				lastScrollY = currentScrollY;
				return;
			}

			const delta = currentScrollY - lastScrollY;
			if (Math.abs(delta) < minDelta) {
				return;
			}

			setIsHiddenByScroll(delta > 0);
			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<motion.div
			ref={headerRef}
			animate={{ y: isHiddenByScroll ? "-120%" : "0%" }}
			transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
			className="view-transition-static-header sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur will-change-transform dark:border-slate-800 dark:bg-slate-950/95"
		>
			<div className="mx-auto flex min-h-12 items-center gap-3 px-5 py-2 sm:min-h-14">
				<div className="flex items-center gap-2 shrink-0">
					<HeaderMobileMenu links={headerNavLinks} isLoading={isLoading} />
					<div className="hidden md:flex">
						<HeaderLogo />
					</div>
				</div>
				<HeaderNav links={headerNavLinks} />
				<div className="ml-auto flex items-center gap-2 shrink-0">
					<div className="hidden [@media(min-width:496px)]:block">
						<ThemeToggle />
					</div>
					<div className="hidden md:flex">
						<Suspense fallback={null}>
							<HeaderSearch />
						</Suspense>
					</div>
					<HeaderUserActions isLoading={isLoading} user={user} tags={tags} />
				</div>
			</div>
		</motion.div>
	);
};

export default Header;
