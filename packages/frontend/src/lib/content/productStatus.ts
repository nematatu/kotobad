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
					title: "ハイライト表示",
					paragraphs: [
						"検索クエリをハイライト表示し、一致部分を分かりやすくしました。",
					],
				},
			],
		},
	},
	{
		date: "2026-03-09",
		title: "モバイル端末の画面遷移にViewTransitionを適用しました",
		category: "new",
	},
	{
		date: "2026-03-08",
		title: "ポストのリアルタイム更新に対応しました",
		detailPage: {
			slug: "post-realtime-update",
			sections: [
				{
					title: "",
					paragraphs: [
						"スレッドを開いたままにしておくと、自動でポストを更新して表示してくれます。",
					],
				},
				{
					title: "技術",
					paragraphs: [
						"Cloudflare の Durable Objects と WebSockets を使って実装しました",
					],
				},
			],
		},
		category: "new",
	},
	{
		date: "2026-03-09",
		title: "ダークモードに対応しました",
		category: "new",
	},
];

export const PRODUCT_UPDATE_DETAIL_SLUGS = PRODUCT_UPDATES.flatMap((update) =>
	update.detailPage ? [update.detailPage.slug] : [],
);

export const getProductUpdateBySlug = (slug: string) =>
	PRODUCT_UPDATES.find((update) => update.detailPage?.slug === slug);
