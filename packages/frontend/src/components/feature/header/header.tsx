"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import GoogleOAuth from "@/components/feature/auth/googleOAuth";
import { Button } from "@/components/ui/button";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { useUser } from "../provider/UserProvider";

const Header = () => {
	const { user, setUser } = useUser();
	const [lastScrollY, setLastScrollY] = useState(0);
	const [showHeader, setShowHeader] = useState(true);

	const handleLogout = async () => {
		const baseUrl = await getBffApiUrl("LOGOUT");
		try {
			const res = await fetch(baseUrl, {
				method: "POST",
				credentials: "include",
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(String(error));
			}
			setUser(null);
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "ログアウトに失敗しました";
			console.error(message);
		}
	};

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
			className={`sticky top-0 z-50 w-full bg-brand-50 transition-transform duration-200 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
		>
			<div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-5">
				<Link href="/">
					<div className="flex items-center space-x-2">
						<LogoMojiIcon className="w-24 text-gray-800" />
						<LogoIcon className="w-8" />
					</div>
				</Link>
				<div className="space-x-2">
					{user && (
						<span className="text-sm text-muted-foreground">
							{user.name ?? user.email}
						</span>
					)}
					{user ? (
						<Button
							className="text-sm font-medium cursor-pointer transition-colors hover:text-primary"
							variant="outline"
							onClick={handleLogout}
						>
							ログアウト
						</Button>
					) : (
						<GoogleOAuth />
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
