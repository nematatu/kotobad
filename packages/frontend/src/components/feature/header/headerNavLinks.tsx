import type { ActionLinkItem } from "@/components/common/button/ActionLink";
import { viewTransitionKeys } from "@/config/viewTransition";

export const headerNavLinks: ActionLinkItem[] = [
	{
		label: "スレッド一覧",
		href: "/threads",
		viewTransitionKey: viewTransitionKeys.threadListNavigation,
	},
	{
		label: "BWFライブデモ",
		href: "/bwf-live-demo",
		viewTransitionKey: viewTransitionKeys.threadListNavigation,
	},
	{ label: "コトバドとは", href: "/#about" },
	{
		label: "更新情報",
		href: "/updates",
		mobileMenuPlacement: "bottom",
		viewTransitionKey: viewTransitionKeys.threadListNavigation,
	},
	{
		label: "開発者のボヤキ",
		href: "/developer-notes",
		mobileMenuPlacement: "bottom",
		viewTransitionKey: viewTransitionKeys.threadListNavigation,
	},
];
