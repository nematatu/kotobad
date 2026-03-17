"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/feature/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
	showLabel?: boolean;
};

export default function ThemeToggle({ className, showLabel = false }: Props) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && resolvedTheme === "dark";
	const label = isDark ? "ライトモード" : "ダークモード";

	return (
		<Button
			type="button"
			variant="ghost"
			size={showLabel ? "sm" : "icon"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={`${label}に切り替える`}
			title={`${label}に切り替える`}
			className={cn(
				"shrink-0 text-slate-600 [@media(hover:hover)]:hover:text-slate-900 dark:text-slate-300 dark:[@media(hover:hover)]:hover:text-white",
				showLabel ? "justify-start px-3" : "",
				className,
			)}
		>
			{isDark ? (
				<SunMedium className="size-6" strokeWidth={1.75} />
			) : (
				<MoonStar className="size-6" strokeWidth={1.75} />
			)}
			{showLabel ? <span>{label} にする</span> : null}
		</Button>
	);
}
