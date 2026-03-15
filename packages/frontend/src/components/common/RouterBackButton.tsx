"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
	label?: string;
	fallbackHref?: string;
	className?: string;
};

export default function RouterBackButton({
	label = "戻る",
	fallbackHref = "/",
	className,
}: Props) {
	const router = useRouter();

	const onBackClick = () => {
		if (window.history.length > 1) {
			router.back();
			return;
		}

		router.push(fallbackHref);
	};

	return (
		<button
			type="button"
			onClick={onBackClick}
			aria-label={label}
			className={cn(
				"inline-flex pb-5 items-center gap-1 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-700/40",
				className,
			)}
		>
			<ArrowLeft className="h-4 w-4" />
			<span>{label}</span>
		</button>
	);
}
