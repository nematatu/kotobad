"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { viewTransitionKeys } from "@/config/viewTransition";
import {
	getLastThreadListHref,
	useViewTransitionRouter,
} from "@/hooks/useViewTransitionRouter";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
};

export function BackToThreadListHeaderButton({ className }: Props) {
	const router = useViewTransitionRouter();

	const onBackClick = () => {
		if (window.history.length > 1) {
			router.back({
				viewTransitionKey: viewTransitionKeys.threadDetailBackNavigation,
			});
			return;
		}

		router.replace(getLastThreadListHref(), {
			restoreScrollOnCommit: true,
			scroll: false,
			viewTransitionKey: viewTransitionKeys.threadDetailBackNavigation,
		});
	};

	return (
		<Button
			variant="ghost"
			enableClickAnimation
			type="button"
			onClick={onBackClick}
			aria-label="スレッド一覧へ戻る"
			className={cn(
				"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:!bg-gray-400/10 dark:[@media(hover:hover)]:hover:!bg-gray-600/30 md:text-sm",
				className,
			)}
		>
			<ArrowLeft className="h-4 w-4" />
			<span>スレッド一覧へ</span>
		</Button>
	);
}
