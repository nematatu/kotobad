"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import CreateThreadButton from "../button/thread/createThread";
import { useUser } from "../provider/UserProvider";
import { UserPopover } from "../user/popover/UserPopover";
import UserAvatar from "./../user/UserAvatar";

const Header = () => {
	const { user } = useUser();
	const [lastScrollY, setLastScrollY] = useState(0);
	const [showHeader, setShowHeader] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY >= lastScrollY && currentScrollY > 50) {
				setShowHeader(false);
			} else {
				setShowHeader(true);
			}
			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<div
			className={`sticky top-0 z-50 w-full transition-transform duration-200 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
		>
			<div className="flex h-16 items-center justify-between max-w-4xl lg:max-w-6xl mx-auto px-5">
				<Link href="/">
					<div className="flex items-center space-x-2">
						<LogoMojiIcon className="w-24 text-gray-800" />
						<LogoIcon className="w-8" />
					</div>
				</Link>
				<div className="flex items-center space-x-2">
					{user ? (
						<div className="flex items-center space-x-4">
							<UserPopover />
							<CreateThreadButton />
						</div>
					) : (
						<GoogleOAuth />
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
