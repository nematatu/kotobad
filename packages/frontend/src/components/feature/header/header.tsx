"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Suspense, useEffect, useRef } from "react";
import { useUser } from "../provider/UserProvider";
import HeaderLogo from "./component/HeaderLogo";
import HeaderMobileMenu from "./component/HeaderMobileMenu";
import HeaderMobileSearch from "./component/HeaderMobileSearch";
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
			className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur"
		>
			<div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-2">
				<div className="flex items-center gap-2 shrink-0">
					<HeaderLogo />
				</div>
				<Suspense
					fallback={
						<div className="hidden flex-1 min-w-0 [@media(min-width:496px)]:block" />
					}
				>
					<HeaderSearch />
				</Suspense>
				<HeaderNav links={headerNavLinks} />
				<div className="ml-auto flex items-center gap-2 shrink-0">
					<HeaderUserActions isLoading={isLoading} user={user} tags={tags} />
					<HeaderMobileSearch />
					<HeaderMobileMenu links={headerNavLinks} />
				</div>
			</div>
		</div>
	);
};

export default Header;
