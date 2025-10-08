"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeMenuToggle from "../darkMode/themeMenuToggle";
import { useUser } from "../provider/UserProvider";
import { logout } from "@/lib/api/auth";
import LogoIcon from "@/assets/logo/logo.svg";
import { useState, useEffect } from "react";

const Header = () => {
    const { user, setUser } = useUser();
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showHeader, setShowHeader] = useState(true);

    const handleLogout = async () => {
        console.log("logout click");
        try {
            await logout();
            setUser(null);
            console.log("logout finish");
        } catch (e: any) {
            console.error(e.message);
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
            className={`sticky top-0 z-50 w-full border-b bg-yellow-200 dark:bg-gray-800 transition-transform duration-200 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
        >
            <div className="flex h-20 items-center px-4">
                <Link href="/">
                    {/* <LogoIcon className="w-20 h-20 text-gray-800 dark:text-gray-200" /> */}
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <ThemeMenuToggle />
                    {user ? (
                        <Button
                            className="text-sm font-medium cursor-pointer transition-colors hover:text-primary"
                            variant="outline"
                            onClick={handleLogout}
                        >
                            ログアウト
                        </Button>
                    ) : (
                        <div className="space-x-2">
                            <Button className="cursor-pointer" variant="outline" asChild>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium  transition-colors hover:text-primary"
                                >
                                    ログイン
                                </Link>
                            </Button>
                            <Button className="cursor-pointer" variant="outline" asChild>
                                <Link
                                    href="/auth/signup"
                                    className="text-sm font-medium  transition-colors hover:text-primary"
                                >
                                    新規会員登録
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
