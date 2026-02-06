"use client";

import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import ActionLink from "@/components/common/button/ActionLink";

type Props = {
	links: ActionLinkItem[];
};

const HeaderNav = ({ links }: Props) => {
	return (
		<nav className="hidden items-center gap-4 text-xs font-semibold text-slate-600 [@media(min-width:496px)]:flex md:text-sm">
			{links.map((item) => (
				<ActionLink key={item.href} item={item} />
			))}
		</nav>
	);
};

export default HeaderNav;
