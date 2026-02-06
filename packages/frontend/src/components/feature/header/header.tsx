"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Suspense, useEffect, useRef } from "react";
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
			<div className="mx-auto flex items-center gap-3 px-5 py-2">
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
					<div className="hidden [@media(min-width:496px)_and_(max-width:767px)]:block">
						<HeaderUserActions
							isLoading={isLoading}
							user={user}
							tags={tags}
							showUserPopover={false}
						/>
					</div>
					<div className="hidden md:block">
						<HeaderUserActions isLoading={isLoading} user={user} tags={tags} />
					</div>
					<HeaderMobileMenu
						links={headerNavLinks}
						tags={tags}
						user={user}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
};

export default Header;
