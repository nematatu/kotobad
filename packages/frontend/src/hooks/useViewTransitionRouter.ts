"use client";

import type { UrlObject } from "node:url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NavigationDirection = "forward" | "back";
type NavigateOptions = {
	scroll?: boolean;
};

const ROUTE_TRANSITION_ATTRIBUTE = "data-route-transition";
const ROUTE_TRANSITION_ID_ATTRIBUTE = "data-route-transition-id";
const ROUTE_TRANSITION_TIMEOUT_MS = 350;

let transitionSequence = 0;
const routeScrollPositions = new Map<string, number>();
let pendingCommit: {
	id: string;
	resolve: () => void;
	timeoutId: number;
} | null = null;
let pendingBackScrollRestore = false;
let previousScrollRestoration: History["scrollRestoration"] | null = null;

const prefersReducedMotion = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type SearchParamsLike =
	| {
			toString: () => string;
	  }
	| null
	| undefined;

export const getViewTransitionRouteKey = (
	pathname: string | null | undefined,
	searchParams?: SearchParamsLike,
) => {
	const search = searchParams?.toString() ?? "";
	return `${pathname ?? ""}${search ? `?${search}` : ""}`;
};

const toNavigationHref = (href: string | UrlObject) => {
	if (typeof href === "string") {
		return href;
	}

	const pathname = href.pathname ?? "";
	const hash = href.hash ?? "";
	const params = new URLSearchParams();

	if (href.search) {
		const search = href.search.startsWith("?")
			? href.search.slice(1)
			: href.search;
		return `${pathname}${search ? `?${search}` : ""}${hash}`;
	}

	if (href.query) {
		for (const [key, value] of Object.entries(href.query)) {
			if (Array.isArray(value)) {
				for (const item of value) {
					if (item !== undefined) {
						params.append(key, String(item));
					}
				}
				continue;
			}

			if (value !== undefined) {
				params.set(key, String(value));
			}
		}
	}

	const search = params.toString();
	return `${pathname}${search ? `?${search}` : ""}${hash}`;
};

const clearPendingCommit = (id?: string) => {
	if (!pendingCommit) {
		return;
	}

	if (id && pendingCommit.id !== id) {
		return;
	}

	window.clearTimeout(pendingCommit.timeoutId);
	pendingCommit.resolve();
	pendingCommit = null;
};

const saveScrollPosition = (routeKey: string) => {
	routeScrollPositions.set(routeKey, window.scrollY);
};

const restoreScrollPosition = (routeKey: string) => {
	const scrollY = routeScrollPositions.get(routeKey);
	if (typeof scrollY !== "number") {
		return;
	}

	window.scrollTo({
		top: scrollY,
		left: 0,
		behavior: "auto",
	});
};

const enableManualScrollRestoration = () => {
	if (previousScrollRestoration === null) {
		previousScrollRestoration = window.history.scrollRestoration;
	}
	window.history.scrollRestoration = "manual";
};

const resetScrollRestoration = () => {
	if (previousScrollRestoration === null) {
		return;
	}

	window.history.scrollRestoration = previousScrollRestoration;
	previousScrollRestoration = null;
};

const waitForNavigationCommit = (id: string) =>
	new Promise<void>((resolve) => {
		clearPendingCommit();
		pendingCommit = {
			id,
			resolve: () => {
				resolve();
			},
			timeoutId: window.setTimeout(() => {
				if (!pendingCommit || pendingCommit.id !== id) {
					return;
				}
				clearPendingCommit(id);
			}, ROUTE_TRANSITION_TIMEOUT_MS),
		};
	});

export const notifyViewTransitionRouteCommit = (routeKey?: string) => {
	if (pendingBackScrollRestore) {
		if (routeKey) {
			restoreScrollPosition(routeKey);
		}
		pendingBackScrollRestore = false;
		resetScrollRestoration();
	}

	if (!pendingCommit) {
		return;
	}

	const { id } = pendingCommit;
	window.requestAnimationFrame(() => {
		clearPendingCommit(id);
	});
};

const startRouteViewTransition = (
	update: () => void,
	direction: NavigationDirection,
) => {
	if (typeof document === "undefined") {
		update();
		return;
	}

	const root = document.documentElement;
	const transitionId = String(++transitionSequence);
	root.setAttribute(ROUTE_TRANSITION_ATTRIBUTE, direction);
	root.setAttribute(ROUTE_TRANSITION_ID_ATTRIBUTE, transitionId);

	const cleanup = () => {
		if (root.getAttribute(ROUTE_TRANSITION_ID_ATTRIBUTE) !== transitionId) {
			return;
		}

		root.removeAttribute(ROUTE_TRANSITION_ATTRIBUTE);
		root.removeAttribute(ROUTE_TRANSITION_ID_ATTRIBUTE);
	};

	if (
		typeof document.startViewTransition !== "function" ||
		prefersReducedMotion()
	) {
		update();
		cleanup();
		return;
	}

	const transition = document.startViewTransition(async () => {
		const committed = waitForNavigationCommit(transitionId);
		update();
		await committed;
	});

	transition.finished.catch(() => {}).finally(cleanup);
};

export function useViewTransitionRouter() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentRouteKey = getViewTransitionRouteKey(pathname, searchParams);

	return {
		back: () => {
			saveScrollPosition(currentRouteKey);
			pendingBackScrollRestore = true;
			enableManualScrollRestoration();
			startRouteViewTransition(() => {
				router.back();
			}, "back");
		},
		push: (href: string | UrlObject, options?: NavigateOptions) => {
			saveScrollPosition(currentRouteKey);
			startRouteViewTransition(() => {
				router.push(toNavigationHref(href), options);
			}, "forward");
		},
		refresh: () => {
			router.refresh();
		},
		replace: (href: string | UrlObject, options?: NavigateOptions) => {
			saveScrollPosition(currentRouteKey);
			startRouteViewTransition(() => {
				router.replace(toNavigationHref(href), options);
			}, "forward");
		},
	};
}
