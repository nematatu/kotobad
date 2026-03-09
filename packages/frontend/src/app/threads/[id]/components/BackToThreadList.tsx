"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
	getLastThreadListHref,
	useViewTransitionRouter,
} from "@/hooks/useViewTransitionRouter";

export function BackToThreadList() {
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
		<button
			type="button"
			onClick={onBackClick}
			aria-label="スレッド一覧へ戻る"
			className="route-transition-floating-action block sm:hidden flex flex-col fixed bottom-20 right-4 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white"
		>
			<Undo2 size={21} />
			<span className="text-[10px]">戻る</span>
		</button>
	);
}
