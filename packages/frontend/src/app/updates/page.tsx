import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import {
	PRODUCT_UPDATE_CATEGORY_META,
	PRODUCT_UPDATES,
} from "@/lib/content/productStatus";
import { cn } from "@/lib/utils";

const formatDottedDate = (value: string) => {
	const [year, month, day] = value.split("-");

	if (!year || !month || !day) {
		return value;
	}

	return `${year}.${month}.${day}`;
};

const UPDATE_TIMELINE_BADGE_CLASS: Record<
	keyof typeof PRODUCT_UPDATE_CATEGORY_META,
	string
> = {
	new: "bg-sky-500 text-white dark:bg-sky-400 dark:text-slate-950",
	improvement:
		"bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950",
	fix: "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950",
};

export default function UpdatesPage() {
	return (
		<div className="relative min-h-screen bg-[#f8fbff]  dark:bg-[#0f172a]">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-24 z-0 rotate-[-10deg] opacity-15 sm:bottom-12"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>
			<section
				id="overview"
				className="relative overflow-hidden border-b border-slate-200/80 scroll-mt-[calc(var(--header-height,0px)+1rem)]"
			>
				<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 sm:pt-26">
					<div className="mx-auto max-w-3xl space-y-4 text-center sm:space-y-5">
						<h1 className="text-2xl font-black tracking-widest text-slate-950 dark:text-slate-50 sm:text-4xl">
							更新情報
						</h1>
					</div>
				</div>
			</section>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
				<section
					id="updates"
					className="mt-14 scroll-mt-[calc(var(--header-height,0px)+1rem)]"
				>
					<div className="mt-10 space-y-10 mx-auto max-w-3xl sm:space-y-12">
						{PRODUCT_UPDATES.map((item, index) => {
							const meta = PRODUCT_UPDATE_CATEGORY_META[item.category];

							return (
								<article
									key={`${item.date}-${item.title}`}
									className="grid gap-4 md:grid-cols-[88px_28px_minmax(0,1fr)] md:gap-8"
								>
									<div className="hidden space-y-3 pt-1 md:block">
										<span
											className={cn(
												"inline-flex min-w-[80px] items-center justify-center rounded-lg text-[14px] px-4 py-2 font-bold",
												UPDATE_TIMELINE_BADGE_CLASS[item.category],
											)}
										>
											{meta.label}
										</span>
										<time className="block text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
											{formatDottedDate(item.date)}
										</time>
									</div>

									<div className="relative hidden justify-center md:flex">
										<Sparkles className="hidden h-5 w-5 shrink-0 fill-current text-amber-400 md:block" />
										{index < PRODUCT_UPDATES.length - 1 ? (
											<span className="absolute top-7 bottom-[-3.2rem] w-px bg-slate-200 dark:bg-slate-800" />
										) : null}
									</div>

									<div className="relative rounded-[26px] border border-slate-200/80 bg-white/88 px-5 py-5 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none dark:border-slate-800 dark:bg-slate-900/72 md:dark:bg-transparent">
										<div className="pl-8 md:pl-0">
											<div className="flex flex-wrap items-center gap-3 md:hidden">
												<span
													className={cn(
														"inline-flex min-w-[92px] items-center justify-center rounded-[12px] px-4 py-1.5 text-[14px] font-bold",
														UPDATE_TIMELINE_BADGE_CLASS[item.category],
													)}
												>
													{meta.label}
												</span>
												<time className="text-[15px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
													{formatDottedDate(item.date)}
												</time>
											</div>

											<div className="mt-4 space-y-4 md:mt-0">
												<div className="flex items-start gap-3">
													<h3 className="text-[28px] leading-[1.35] font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-xl">
														{item.title}
													</h3>
												</div>
												{item.detailPage ? (
													<Link
														href={`/updates/${item.detailPage.slug}`}
														className="inline-flex items-center gap-2 text-[15px] font-semibold text-sky-600 underline-offset-4 hover:text-sky-500 hover:underline dark:text-sky-300 dark:hover:text-sky-200"
													>
														詳しく
														<ArrowRight className="h-4 w-4" />
													</Link>
												) : null}
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
	);
}
