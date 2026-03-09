"use client";

export type ViewTransitionDirection = "forward" | "back";
export type ViewTransitionNavigationMethod = "push" | "replace" | "back";

export const viewTransitionKeys = {
	homeNavigation: "home-navigation",
	searchPageNavigation: "search-page-navigation",
	searchPageQueryControls: "search-page-query-controls",
	threadDetailBackNavigation: "thread-detail-back-navigation",
	threadListNavigation: "thread-list-navigation",
	threadListQueryControls: "thread-list-query-controls",
} as const;

export type ViewTransitionKey =
	(typeof viewTransitionKeys)[keyof typeof viewTransitionKeys];

export type ViewTransitionTarget = {
	pathname: string;
	searchParams: URLSearchParams;
};

type ViewTransitionBehavior = {
	enabled: boolean;
	direction: ViewTransitionDirection;
	ruleId: string;
};

type ViewTransitionContext = {
	current: ViewTransitionTarget;
	next: ViewTransitionTarget | null;
	method: ViewTransitionNavigationMethod;
	key?: ViewTransitionKey;
};

type ViewTransitionRule = {
	id: string;
	matches: (context: ViewTransitionContext) => boolean;
	resolve: (context: ViewTransitionContext) => ViewTransitionBehavior;
};

const THREAD_LIST_QUERY_CONTROL_KEYS = new Set(["page", "sort"]);

const isThreadDetailPath = (pathname: string) =>
	/^\/threads\/[^/]+$/.test(pathname);

const getChangedQueryKeys = (
	current: URLSearchParams,
	next: URLSearchParams,
): string[] => {
	const keys = new Set([...current.keys(), ...next.keys()]);

	return [...keys].filter((key) => {
		const currentValues = current.getAll(key);
		const nextValues = next.getAll(key);

		if (currentValues.length !== nextValues.length) {
			return true;
		}

		return currentValues.some((value, index) => value !== nextValues[index]);
	});
};

const viewTransitionRules: ViewTransitionRule[] = [
	{
		id: "search-page-navigation-on-search-page",
		matches: ({ current, next, key }) =>
			key === viewTransitionKeys.searchPageNavigation &&
			current.pathname === "/search" &&
			next?.pathname === "/search",
		resolve: () => ({
			enabled: false,
			direction: "forward",
			ruleId: "search-page-navigation-on-search-page",
		}),
	},
	{
		id: "search-page-query-controls",
		matches: ({ key }) => key === viewTransitionKeys.searchPageQueryControls,
		resolve: () => ({
			enabled: false,
			direction: "forward",
			ruleId: "search-page-query-controls",
		}),
	},
	{
		id: "thread-detail-back-navigation",
		matches: ({ key, next }) =>
			key === viewTransitionKeys.threadDetailBackNavigation &&
			next?.pathname === "/threads",
		resolve: () => ({
			enabled: false,
			direction: "back",
			ruleId: "thread-detail-back-navigation",
		}),
	},
	{
		id: "thread-list-navigation-on-thread-list",
		matches: ({ current, next, key }) =>
			key === viewTransitionKeys.threadListNavigation &&
			current.pathname === "/threads" &&
			next?.pathname === "/threads",
		resolve: () => ({
			enabled: false,
			direction: "forward",
			ruleId: "thread-list-navigation-on-thread-list",
		}),
	},
	{
		id: "thread-list-query-controls",
		matches: ({ current, next, key }) => {
			if (key === viewTransitionKeys.threadListQueryControls) {
				return true;
			}

			if (!next) {
				return false;
			}

			if (current.pathname !== "/threads" || next.pathname !== "/threads") {
				return false;
			}

			const changedQueryKeys = getChangedQueryKeys(
				current.searchParams,
				next.searchParams,
			);

			return (
				changedQueryKeys.length > 0 &&
				changedQueryKeys.every((queryKey) =>
					THREAD_LIST_QUERY_CONTROL_KEYS.has(queryKey),
				)
			);
		},
		resolve: () => ({
			enabled: false,
			direction: "forward",
			ruleId: "thread-list-query-controls",
		}),
	},
	{
		id: "home-navigation",
		matches: ({ next, key }) =>
			key === viewTransitionKeys.homeNavigation && next?.pathname === "/",
		resolve: () => ({
			enabled: true,
			direction: "back",
			ruleId: "home-navigation",
		}),
	},
	{
		id: "thread-detail-to-thread-list",
		matches: ({ current, next }) =>
			next !== null &&
			isThreadDetailPath(current.pathname) &&
			next.pathname === "/threads",
		resolve: () => ({
			enabled: true,
			direction: "back",
			ruleId: "thread-detail-to-thread-list",
		}),
	},
];

export const resolveViewTransitionBehavior = (
	context: ViewTransitionContext,
): ViewTransitionBehavior => {
	const matchedRule = viewTransitionRules.find((rule) => rule.matches(context));
	if (matchedRule) {
		return matchedRule.resolve(context);
	}

	return {
		enabled: true,
		direction: context.method === "back" ? "back" : "forward",
		ruleId: "default",
	};
};
