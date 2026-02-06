"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
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

	return (
		<div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-2">
				<div className="flex items-center gap-2 shrink-0">
					<HeaderMobileMenu links={headerNavLinks} />
					<HeaderLogo />
				</div>
				<HeaderSearch />
				<HeaderNav links={headerNavLinks} />
				<div className="flex items-center gap-2 shrink-0">
					<HeaderUserActions isLoading={isLoading} user={user} tags={tags} />
				</div>
			</div>
		</div>
	);
};

export default Header;
