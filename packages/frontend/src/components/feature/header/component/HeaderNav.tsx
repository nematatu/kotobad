"use client";

import { Link } from "@/components/common/Link";
import type { HeaderNavLink } from "../headerNavLinks";

type Props = {
	links: HeaderNavLink[];
};

const HeaderNav = ({ links }: Props) => {
	return (
		<nav className="hidden items-center gap-4 text-xs font-semibold text-slate-600 [@media(min-width:496px)]:flex md:text-sm">
			{links.map((item) => (
				<Link
					key={item.name}
					href={item.link}
					className="flex items-center rounded-lg gap-2 px-3 py-2 transition hover:bg-gray-100"
				>
					<span>{item.name}</span>
					{item.label ?? null}
				</Link>
			))}
		</nav>
	);
};

export default HeaderNav;
