import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeMenuToggle from "../darkMode/themeMenuToggle";

const Header = () => {
	return (
		<div className="sticky top-0 z-50 w-full border-b bg-yellow-200 dark:bg-gray-800">
			<div className="flex h-24 items-center px-4">
				<div className="flex items-center space-x-4">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="font-bold text-3xl">B3S</span>
					</Link>
					<div className="flex flex-col">
						<span className="text-lg italic">バドミントン掲示板</span>
						<span className="text-sm italic">
							~<span className="font-bold">B</span>adminton{" "}
							<span className="font-bold">B</span>ullutin{" "}
							<span className="font-bold">B</span>oard{" "}
							<span className="font-bold">S</span>ystem~
						</span>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-end space-x-2">
					<ThemeMenuToggle />
					<Button variant="outline" asChild>
						<Link
							href="/auth/login"
							className="text-sm font-medium  transition-colors hover:text-primary"
						>
							ログイン
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link
							href="/auth/signup"
							className="text-sm font-medium  transition-colors hover:text-primary"
						>
							新規会員登録
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Header;
