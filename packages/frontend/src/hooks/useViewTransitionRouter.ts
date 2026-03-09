"use client";

import type { UrlObject } from "node:url";
import { useRouter } from "next/navigation";
import {
	resolveViewTransitionBehavior,
	type ViewTransitionDirection,
	type ViewTransitionKey,
	type ViewTransitionNavigationMethod,
	type ViewTransitionTarget,
} from "@/config/viewTransition";

export type ViewTransitionNavigateOptions = {
	scroll?: boolean;
	viewTransitionKey?: ViewTransitionKey;
};

type ViewTransitionRouter = {
	back: (options?: ViewTransitionNavigateOptions) => void;
	push: (
		href: string | UrlObject,
		options?: ViewTransitionNavigateOptions,
	) => void;
	refresh: () => void;
	replace: (
		href: string | UrlObject,
		options?: ViewTransitionNavigateOptions,
	) => void;
};

const ROUTE_TRANSITION_ATTRIBUTE = "data-route-transition";
const ROUTE_TRANSITION_ID_ATTRIBUTE = "data-route-transition-id";
const ROUTE_TRANSITION_TIMEOUT_MS = 350;
const VIEW_TRANSITION_MOBILE_MEDIA_QUERY = "(max-width: 495px)";

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

const isMobileViewport = () =>
	window.matchMedia(VIEW_TRANSITION_MOBILE_MEDIA_QUERY).matches;

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

const getCurrentNavigationTarget = (): ViewTransitionTarget => ({
	pathname: window.location.pathname,
	searchParams: new URLSearchParams(window.location.search),
});

const getCurrentRouteKey = () =>
	getViewTransitionRouteKey(
		window.location.pathname,
		new URLSearchParams(window.location.search),
	);

const toNavigationTarget = (href: string): ViewTransitionTarget => {
	const url = new URL(href, window.location.href);
	return {
		pathname: url.pathname,
		searchParams: new URLSearchParams(url.searchParams),
	};
};

const toNextNavigationOptions = (options?: ViewTransitionNavigateOptions) => ({
	scroll: options?.scroll,
});

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

const resolveNavigationDirection = (
	method: ViewTransitionNavigationMethod,
	href?: string | UrlObject,
	viewTransitionKey?: ViewTransitionKey,
): ReturnType<typeof resolveViewTransitionBehavior> => {
	if (typeof window === "undefined") {
		return {
			enabled: true,
			direction: method === "back" ? "back" : "forward",
			ruleId: "server-fallback",
		};
	}

	return resolveViewTransitionBehavior({
		current: getCurrentNavigationTarget(),
		next: href ? toNavigationTarget(toNavigationHref(href)) : null,
		method,
		key: viewTransitionKey,
	});
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
	direction: ViewTransitionDirection,
) => {
	if (
		typeof document === "undefined" ||
		typeof document.startViewTransition !== "function" ||
		prefersReducedMotion() ||
		!isMobileViewport()
	) {
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

	const transition = document.startViewTransition(async () => {
		const committed = waitForNavigationCommit(transitionId);
		update();
		await committed;
	});

	transition.finished.catch(() => {}).finally(cleanup);
};

export function useViewTransitionRouter(): ViewTransitionRouter {
	const router = useRouter();

	return {
		back: (options?: ViewTransitionNavigateOptions) => {
			const currentRouteKey = getCurrentRouteKey();
			saveScrollPosition(currentRouteKey);
			pendingBackScrollRestore = true;
			enableManualScrollRestoration();
			const behavior = resolveNavigationDirection(
				"back",
				undefined,
				options?.viewTransitionKey,
			);
			if (!behavior.enabled) {
				router.back();
				return;
			}
			startRouteViewTransition(() => {
				router.back();
			}, behavior.direction);
		},
		push: (
			href: string | UrlObject,
			options?: ViewTransitionNavigateOptions,
		) => {
			const currentRouteKey = getCurrentRouteKey();
			saveScrollPosition(currentRouteKey);
			const behavior = resolveNavigationDirection(
				"push",
				href,
				options?.viewTransitionKey,
			);
			if (!behavior.enabled) {
				router.push(toNavigationHref(href), toNextNavigationOptions(options));
				return;
			}
			startRouteViewTransition(() => {
				router.push(toNavigationHref(href), toNextNavigationOptions(options));
			}, behavior.direction);
		},
		refresh: () => {
			router.refresh();
		},
		replace: (
			href: string | UrlObject,
			options?: ViewTransitionNavigateOptions,
		) => {
			const currentRouteKey = getCurrentRouteKey();
			saveScrollPosition(currentRouteKey);
			const behavior = resolveNavigationDirection(
				"replace",
				href,
				options?.viewTransitionKey,
			);
			if (!behavior.enabled) {
				router.replace(
					toNavigationHref(href),
					toNextNavigationOptions(options),
				);
				return;
			}
			startRouteViewTransition(() => {
				router.replace(
					toNavigationHref(href),
					toNextNavigationOptions(options),
				);
			}, behavior.direction);
		},
	};
}
