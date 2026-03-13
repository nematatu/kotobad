"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { useEffect, useRef } from "react";
import ThemeToggle from "@/components/feature/theme/ThemeToggle";
import { useUser } from "../provider/UserProvider";
import HeaderLogo from "./component/HeaderLogo";
import HeaderMobileMenu from "./component/HeaderMobileMenu";
import HeaderNav from "./component/HeaderNav";
import HeaderUserActions from "./component/HeaderUserActions";
import { headerNavLinks } from "./headerNavLinks";

type Props = {
	tags: TagType[];
};

const Header = ({ tags }: Props) => {
	const { user, isLoading } = useUser();
	const headerRef = useRef<HTMLDivElement>(null);

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

	return (
		<div
			ref={headerRef}
			className="view-transition-static-header sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
		>
			<div className="mx-auto flex items-center gap-3 px-5 py-2">
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
					<HeaderUserActions isLoading={isLoading} user={user} tags={tags} />
				</div>
			</div>
		</div>
	);
};

export default Header;
