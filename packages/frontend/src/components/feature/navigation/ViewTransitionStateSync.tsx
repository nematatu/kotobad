"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import {
	getViewTransitionRouteKey,
	notifyViewTransitionRouteCommit,
} from "@/hooks/useViewTransitionRouter";

export default function ViewTransitionStateSync() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const routeCommitKey = getViewTransitionRouteKey(pathname, searchParams);

	useLayoutEffect(() => {
		notifyViewTransitionRouteCommit(routeCommitKey);
	}, [routeCommitKey]);

	return null;
}
