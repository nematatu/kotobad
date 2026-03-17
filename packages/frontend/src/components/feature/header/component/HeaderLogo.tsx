"use client";

import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import { Link } from "@/components/common/Link";
import { viewTransitionKeys } from "@/config/viewTransition";

const HeaderLogo = () => {
	return (
		<Link
			href="/"
			viewTransitionKey={viewTransitionKeys.homeNavigation}
			aria-label="ホームへ移動"
			className="group flex items-center gap-2 px-2"
		>
			<span className="inline-flex transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 motion-reduce:group-hover:[animation:none]">
				<LogoIcon className="w-6 sm:w-8" />
			</span>
			<LogoMojiIcon className="w-[70px] sm:w-24 text-gray-800 dark:text-slate-50" />
		</Link>
	);
};

export default HeaderLogo;
