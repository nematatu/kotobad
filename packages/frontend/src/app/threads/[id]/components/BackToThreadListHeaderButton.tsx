"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	getLastThreadListHref,
	useViewTransitionRouter,
} from "@/hooks/useViewTransitionRouter";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
};

export function BackToThreadListHeaderButton({ className }: Props) {
	const transitionRouter = useViewTransitionRouter();
	const router = useRouter();

	useEffect(() => {
		router.prefetch(getLastThreadListHref());
	}, [router]);

	const onBackClick = () => {
		transitionRouter.replace(getLastThreadListHref(), {
			restoreScrollOnCommit: true,
			scroll: false,
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
				"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:bg-gray-100 md:text-sm",
				className,
			)}
		>
			<ArrowLeft className="h-4 w-4" />
			<span>スレッド一覧へ</span>
		</Button>
	);
}
