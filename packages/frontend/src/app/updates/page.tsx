import { Sparkles } from "lucide-react";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import {
	PRODUCT_UPDATE_CATEGORY_META,
	PRODUCT_UPDATES,
	ROADMAP_LANES,
} from "@/lib/content/productStatus";
import { cn } from "@/lib/utils";

const formatJapaneseDate = (value: string) => {
	const [year, month, day] = value.split("-");

	if (!year || !month || !day) {
		return value;
	}

	return `${year}年${Number(month)}月${Number(day)}日`;
};

const ROADMAP_STATUS_META = {
	進行中: {
		label: "WIP",
		badgeClass:
			"border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-200",
		chipClass:
			"bg-white/80 text-slate-700 dark:bg-slate-900/80 dark:text-slate-100",
	},
	次に整えたいこと: {
		label: "Next",
		badgeClass:
			"border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200",
		chipClass:
			"bg-white/80 text-slate-700 dark:bg-slate-900/80 dark:text-slate-100",
	},
	構想中: {
		label: "Idea",
		badgeClass:
			"border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
		chipClass:
			"bg-white/70 text-slate-500 dark:bg-slate-900/70 dark:text-slate-300",
	},
} as const;

const roadmapItems = ROADMAP_LANES.flatMap((lane) =>
	lane.items.map((item) => ({
		...item,
		laneTitle: lane.title,
		status: ROADMAP_STATUS_META[lane.title as keyof typeof ROADMAP_STATUS_META],
	})),
);

const ROADMAP_LABEL_OVERRIDES: Record<string, string> = {
	モバイル導線の磨き込み: "モバイル導線",
	ダークモードの細部調整: "ダークモード",
	検索体験の整理: "検索体験",
	情報ページの拡充: "情報ページ",
	通知まわりの分かりやすさ向上: "通知改善",
	プロフィール導線の整理: "プロフィール",
};

export default function UpdatesPage() {
	return (
		<div className="relative min-h-full">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-32 sm:bottom-12 z-0 rotate-[-10deg] opacity-20"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>
			<div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 pt-20 sm:pt-26">
				<div className="relative space-y-14">
					<h1 className="text-center text-2xl sm:text-4xl font-bold tracking-[.11em] text-slate-950 dark:text-slate-50">
						お知らせと更新情報
					</h1>

					<section className="space-y-5">
						<h1 className="text-[21px] font-bold tracking-tight text-slate-950 dark:text-slate-50">
							ロードマップ
						</h1>
						<div className="flex flex-wrap gap-x-3 gap-y-4">
							{roadmapItems.map((item) => (
								<div
									key={`${item.laneTitle}-${item.title}`}
									className="relative"
								>
									<div
										className={cn(
											"rounded-[18px] px-4 py-3 text-[15px] leading-[1.2] font-medium tracking-tight shadow-[0_8px_18px_rgba(148,163,184,0.14)]",
											item.status.chipClass,
										)}
										title={item.title}
									>
										{ROADMAP_LABEL_OVERRIDES[item.title] ?? item.title}
									</div>
									<span
										className={cn(
											"absolute -bottom-3 right-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-black tracking-wide shadow-sm",
											item.status.badgeClass,
										)}
									>
										{item.status.label}
									</span>
								</div>
							))}
						</div>
					</section>

					<section className="space-y-5">
						<h1 className="text-[21px] font-bold tracking-tight text-slate-950 dark:text-slate-50">
							更新情報
						</h1>
						<div className="relative space-y-7">
							<div
								className="pointer-events-none absolute left-[14px] top-10 bottom-10 z-0 w-[3px] [--timeline-line:#b8c4d3] dark:[--timeline-line:#334155] sm:left-[18px]"
								style={{
									backgroundImage:
										"repeating-linear-gradient(to bottom, var(--timeline-line) 0, var(--timeline-line) 10px, transparent 10px, transparent 16px)",
								}}
							/>
							{PRODUCT_UPDATES.map((item, index) => {
								const meta = PRODUCT_UPDATE_CATEGORY_META[item.category];
								const updateNumber = String(
									PRODUCT_UPDATES.length - index,
								).padStart(2, "0");

								return (
									<article
										key={`${item.date}-${item.title}`}
										className="relative grid grid-cols-[28px_1fr] gap-3 sm:grid-cols-[36px_1fr] sm:gap-5"
									>
										<div className="relative flex items-start justify-center pt-1">
											<div className="relative z-10 rounded-full bg-[#e9edf3] p-1 text-amber-400 dark:bg-[#0f172a]">
												<Sparkles className="h-5 w-5 fill-current" />
											</div>
										</div>
										<div className="space-y-3">
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-slate-500 dark:text-slate-300">
												<span>{formatJapaneseDate(item.date)}</span>
												<span className="font-bold text-sky-500">
													update #{updateNumber}
												</span>
											</div>
											<div className="rounded-[25px] bg-white px-5 py-6 shadow-[0_12px_26px_rgba(148,163,184,0.14)] dark:bg-slate-900">
												<div className="space-y-4">
													<h2 className="text-[17px] leading-[26px] font-bold tracking-tight text-slate-950 dark:text-slate-50">
														{item.title}
													</h2>
													<div className="flex flex-wrap gap-3">
														<span className="inline-flex rounded-[14px] bg-sky-100 px-3 py-1.5 text-[14px] font-bold text-sky-600 dark:bg-sky-500/10 dark:text-sky-200">
															Web
														</span>
														<span
															className={cn(
																"inline-flex rounded-[14px] border px-3 py-1.5 text-[14px] font-bold",
																meta.className,
															)}
														>
															{meta.label}
														</span>
													</div>
												</div>
											</div>
										</div>
									</article>
								);
							})}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
