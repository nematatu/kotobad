"use client";

import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { viewTransitionKeys } from "@/config/viewTransition";
import {
	getLastThreadListHref,
	useViewTransitionRouter,
} from "@/hooks/useViewTransitionRouter";

export function BackToThreadList() {
	const router = useViewTransitionRouter();

	const onBackClick = () => {
		router.replace(getLastThreadListHref(), {
			restoreScrollOnCommit: true,
			scroll: false,
			viewTransitionKey: viewTransitionKeys.threadDetailBackNavigation,
		});
	};

	return (
		<Button
			enableClickAnimation
			onClick={onBackClick}
			aria-label="スレッド一覧へ戻る"
			className="route-transition-floating-action pointer-events-auto block sm:hidden flex flex-col fixed bottom-20 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white"
		>
			<Undo2 size={21} />
			<span className="text-[10px]">戻る</span>
		</Button>
	);
}
