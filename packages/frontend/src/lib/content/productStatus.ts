export type ProductUpdateCategory = "feature" | "improvement" | "fix";

export type ProductUpdate = {
	date: string;
	title: string;
	summary: string;
	category: ProductUpdateCategory;
	important?: boolean;
	highlights: string[];
};

export const PRODUCT_UPDATE_CATEGORY_META: Record<
	ProductUpdateCategory,
	{ label: string; className: string }
> = {
	feature: {
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
		title: "スレッド検索ページを公開",
		summary:
			"ヘッダーの検索アイコンから移動できる専用検索ページを追加し、検索導線を整理しました。",
		category: "feature",
		important: true,
		highlights: [
			"検索入力に合わせて結果を更新",
			"検索結果ページから並び順を変更可能",
			"検索語をタイトル内でハイライト表示",
		],
	},
	{
		date: "2026-03-10",
		title: "テーマ切り替えまわりを調整",
		summary:
			"ダークモード利用時の細かな見え方を整え、テーマトグルの扱いも改善しました。",
		category: "improvement",
		highlights: [
			"テーマトグルの操作性を調整",
			"ホバーや固定要素の見え方を継続改善",
		],
	},
	{
		date: "2026-03-09",
		title: "モバイル画面遷移を改善",
		summary:
			"スレッド一覧と詳細の移動を中心に、モバイルでの遷移体験を見直しました。",
		category: "improvement",
		important: true,
		highlights: [
			"View Transition の導入と遷移方向の整理",
			"戻る操作時のスクロール位置復元を改善",
			"ボトムナビや遷移速度の細部を調整",
		],
	},
	{
		date: "2026-03-09",
		title: "ダークモードに対応",
		summary:
			"既存 UI を保ちながら、閲覧時のテーマを切り替えられるようにしました。",
		category: "feature",
		important: true,
		highlights: [
			"ライトモードの見た目を維持",
			"ダークモード用の配色と固定背景を追加",
		],
	},
	{
		date: "2026-03-06",
		title: "返信通知を追加",
		summary:
			"自分の投稿に対する返信を把握しやすくするため、通知まわりを拡張しました。",
		category: "feature",
		important: true,
		highlights: [
			"返信を起点にした通知導線を追加",
			"モバイル操作との整合性もあわせて調整",
		],
	},
	{
		date: "2026-02-21",
		title: "ログイン導線を見直し",
		summary: "投稿前の導線を整理するため、ログイン訴求モーダルを追加しました。",
		category: "fix",
		highlights: [
			"未ログイン時の行き止まりを減らす改善",
			"投稿アクション前の案内を強化",
		],
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

export type RoadmapLane = {
	title: string;
	kicker: string;
	description: string;
	className: string;
	items: Array<{
		title: string;
		summary: string;
		tags: string[];
	}>;
};

export const ROADMAP_LANES: RoadmapLane[] = [
	{
		title: "進行中",
		kicker: "Now",
		description: "直近の実装履歴から見えている、継続改善中のテーマです。",
		className:
			"border-blue-200 bg-blue-50/70 dark:border-blue-400/20 dark:bg-blue-500/10",
		items: [
			{
				title: "モバイル導線の磨き込み",
				summary:
					"一覧と詳細の移動、固定ナビ、戻る操作など、手触りに直結する部分を継続的に調整します。",
				tags: ["モバイル", "導線", "UX"],
			},
			{
				title: "ダークモードの細部調整",
				summary:
					"背景、ホバー、固定要素の見え方を崩さずに、夜間でも読みやすい状態へ寄せていきます。",
				tags: ["ダークモード", "UI"],
			},
		],
	},
	{
		title: "次に整えたいこと",
		kicker: "Next",
		description: "時期は未定ですが、近い将来に整理したいテーマです。",
		className:
			"border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-500/10",
		items: [
			{
				title: "検索体験の整理",
				summary:
					"検索ページ、サジェスト、並び順の導線を含め、目的のスレッドに辿り着きやすい形へ整えます。",
				tags: ["検索", "導線"],
			},
			{
				title: "情報ページの拡充",
				summary:
					"お知らせ、ロードマップ、ガイドを整備し、更新内容を追いやすくします。",
				tags: ["更新情報", "ガイド"],
			},
		],
	},
	{
		title: "構想中",
		kicker: "Idea",
		description: "方向性のメモです。公開順や実装時期はまだ確定していません。",
		className:
			"border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/60",
		items: [
			{
				title: "通知まわりの分かりやすさ向上",
				summary:
					"返信通知を含め、気づきやすさとノイズの少なさのバランスを見直します。",
				tags: ["通知", "体験改善"],
			},
			{
				title: "プロフィール導線の整理",
				summary:
					"メニューからプロフィールへ移動したときの体験や、閲覧導線の分かりやすさを整えます。",
				tags: ["プロフィール", "ナビゲーション"],
			},
		],
	},
];
