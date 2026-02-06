export type FooterItem = {
	label: string;
	href: string;
	external?: boolean;
	badge?: string;
	icon?: "twitter" | "github";
};

export type FooterSection = {
	title: string;
	items: FooterItem[];
};

export const FOOTER_SECTIONS = [
	{
		title: "About",
		items: [
			{ label: "kotobadとは？", href: "/" },
			{ label: "お知らせ", href: "/" },
			{ label: "開発ロードマップ", href: "/" },
		],
	},
	{
		title: "Guides",
		items: [
			{ label: "使い方", href: "/" },
			{ label: "よくある質問", href: "/", badge: "New" },
		],
	},
	{
		title: "Links",
		items: [
			{
				label: "X",
				href: "https://x.com/kotobad",
				external: true,
				icon: "twitter",
			},
			{
				label: "GitHub",
				href: "https://github.com/nematatu/kotobad",
				external: true,
				icon: "github",
			},
		],
	},
	{
		title: "Legal",
		items: [{ label: "利用規約", href: "/terms" }],
	},
] satisfies FooterSection[];
