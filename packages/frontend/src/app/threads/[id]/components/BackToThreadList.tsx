"use client";

import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { viewTransitionKeys } from "@/config/viewTransition";
import {
	getLastThreadListHref,
	useViewTransitionRouter,
} from "@/hooks/useViewTransitionRouter";

export function BackToThreadList() {
	const router = useViewTransitionRouter();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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

	if (!mounted) {
		return null;
	}

	return createPortal(
		<Button
			enableClickAnimation
			onClick={onBackClick}
			aria-label="スレッド一覧へ戻る"
			className="route-transition-floating-action pointer-events-auto block sm:hidden fixed bottom-30 right-4 z-[70] inline-flex h-14 w-14 flex-col items-center justify-center rounded-full border border-slate-200 bg-blue-500/90 text-white"
		>
			<Undo2 size={21} />
			<span className="text-[10px]">戻る</span>
		</Button>,
		document.body,
	);
}
