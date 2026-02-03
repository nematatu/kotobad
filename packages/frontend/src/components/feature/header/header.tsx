"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import { Link } from "@/components/common/Link";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import { useUser } from "../provider/UserProvider";
import CreateThreadDialog from "./component/compoicreateThreadDialog";
import { headerNavLinks } from "./headerNavLinks";

type Props = {
	tags: TagType[];
};

const Header = ({ tags }: Props) => {
	const { user, isLoading } = useUser();

	return (
		<div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
				<Link
					href="/"
					className="group flex items-center justify-center gap-2 shrink-0 px-4 py-3"
				>
					<span className="inline-flex transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 motion-reduce:group-hover:[animation:none]">
						<LogoIcon className="w-8" />
					</span>
					<LogoMojiIcon className="w-24 text-gray-800" />
				</Link>
				<nav className="hidden flex-1 items-center justify-end md:gap-4 text-xs md:text-sm font-semibold text-slate-600 md:flex">
					{headerNavLinks.map((item) => (
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
				<div className="ml-auto flex items-center space-x-2">
					{isLoading ? (
						<div
							className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"
							aria-hidden="true"
						/>
					) : user ? (
						<CreateThreadDialog tags={tags} />
					) : (
						<GoogleOAuth />
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
