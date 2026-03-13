"use client";

import { usePathname } from "next/navigation";
import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import ActionLink from "@/components/common/button/ActionLink";

type Props = {
	links: ActionLinkItem[];
};

const isActiveHref = (pathname: string, href: string) => {
	if (href === "/") {
		return pathname === "/";
	}

	if (href === "/threads") {
		return pathname === "/threads" || pathname.startsWith("/threads/");
	}

	return pathname === href || pathname.startsWith(`${href}/`);
};

const HeaderNav = ({ links }: Props) => {
	const pathname = usePathname();

	return (
		<nav className="hidden items-center gap-4 text-xs font-semibold md:flex md:text-sm">
			{links.map((item) => {
				const isActive = isActiveHref(pathname, item.href);

				return (
					<ActionLink
						key={item.href}
						item={item}
						className={
							isActive
								? "bg-[#5A86FF]/12 text-[#5A86FF] [@media(hover:hover)]:hover:!bg-[#5A86FF]/18 [@media(hover:hover)]:hover:!text-[#5A86FF] dark:bg-[#5A86FF]/22 dark:[@media(hover:hover)]:hover:!bg-[#5A86FF]/26"
								: undefined
						}
					/>
				);
			})}
		</nav>
	);
};

export default HeaderNav;
