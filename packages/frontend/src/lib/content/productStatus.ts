export type ProductUpdateCategory = "new" | "improvement" | "fix";

export type ProductUpdateDetailSection = {
	title: string;
	paragraphs: string[];
};

export type ProductUpdateDetailPage = {
	slug: string;
	sections: ProductUpdateDetailSection[];
};

export type ProductUpdate = {
	date: string;
	title: string;
	category: ProductUpdateCategory;
	important?: boolean;
	detailPage?: ProductUpdateDetailPage;
};

export const PRODUCT_UPDATE_CATEGORY_META: Record<
	ProductUpdateCategory,
	{ label: string; className: string }
> = {
	new: {
		label: "New",
		className:
			"border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-200",
	},
	improvement: {
		label: "Improve",
		className:
			"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200",
	},
	fix: {
		label: "Fix",
		className:
			"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200",
	},
};

export const PRODUCT_UPDATES: ProductUpdate[] = [
	{
		date: "2026-03-10",
		title: "スレッド検索ページを作りました",
		category: "new",
		important: true,
		detailPage: {
			slug: "thread-search-page",
			sections: [
				{
					title: "検索ページ",
					paragraphs: [
						"ヘッダーの検索アイコンから検索ページへ移動でき、リアルタイム検索を行うことができます。",
					],
				},
				{
					title: "使いやすさの調整",
					paragraphs: [
						"検索語は結果一覧のタイトル内でハイライト表示し、どのスレッドが一致しているのかを見分けやすくしました。",
					],
				},
			],
		},
	},
	{
		date: "2026-03-09",
		title: "ダークモードに対応しました",
		category: "new",
	},
];

export const PRODUCT_UPDATE_FILTERS = [
	{ key: "all", label: "すべて" },
	{ key: "feature", label: "機能追加" },
	{ key: "improvement", label: "改善" },
	{ key: "fix", label: "修正" },
] as const;

export type ProductUpdateFilter =
	(typeof PRODUCT_UPDATE_FILTERS)[number]["key"];

export const isProductUpdateFilter = (
	value: string | undefined,
): value is ProductUpdateFilter =>
	PRODUCT_UPDATE_FILTERS.some((filter) => filter.key === value);

export const PRODUCT_UPDATE_DETAIL_SLUGS = PRODUCT_UPDATES.flatMap((update) =>
	update.detailPage ? [update.detailPage.slug] : [],
);

export const getProductUpdateBySlug = (slug: string) =>
	PRODUCT_UPDATES.find((update) => update.detailPage?.slug === slug);
