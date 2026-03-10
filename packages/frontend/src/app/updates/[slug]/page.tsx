import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import {
	getProductUpdateBySlug,
	PRODUCT_UPDATE_CATEGORY_META,
	PRODUCT_UPDATE_DETAIL_SLUGS,
} from "@/lib/content/productStatus";
import { cn } from "@/lib/utils";

type Props = {
	params: Promise<{ slug: string }>;
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

export function generateStaticParams() {
	return PRODUCT_UPDATE_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export default async function UpdateDetailPage({ params }: Props) {
	const { slug } = await params;
	const update = getProductUpdateBySlug(slug);

	if (!update?.detailPage) {
		return notFound();
	}

	const meta = PRODUCT_UPDATE_CATEGORY_META[update.category];

	return (
		<div className="relative min-h-screen bg-[#f8fbff] dark:bg-[#0f172a]">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-24 z-0 rotate-[-10deg] opacity-15 sm:bottom-12"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>
			<Link
				href="/updates"
				className="fixed left-4 top-[calc(var(--header-height,0px)+0.75rem)] z-[60] inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:absolute sm:top-4 sm:z-10"
			>
				<ArrowLeft className="h-4 w-4" />
				更新情報へ戻る
			</Link>
			<section
				id="overview"
				className="relative mx-auto w-full max-w-3xl overflow-hidden border-b border-slate-200/80 scroll-mt-[calc(var(--header-height,0px)+1rem)]"
			>
				<div className="relative z-10 px-4 pt-20 pb-6 sm:px-0 sm:pb-10 sm:pt-26">
					<h1 className="text-xl font-black tracking-[0.1em] text-slate-950 dark:text-slate-50 sm:text-3xl">
						{update.title}
					</h1>
				</div>
				<div className="flex flex-wrap pl-5 sm:pl-0 pb-2 items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-300">
					<span>{update.date}</span>
					<span
						className={cn(
							"inline-flex min-w-[30px] items-center justify-center rounded-lg text-xs px-2 py-1 font-bold",
							UPDATE_TIMELINE_BADGE_CLASS[update.category],
						)}
					>
						{meta.label}
					</span>
				</div>
			</section>
			<div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
				<article className="mt-6 space-y-8 rounded-[28px] bg-white px-5 py-6  dark:bg-slate-900 sm:px-8 sm:py-8">
					{update.detailPage.sections.map((section) => (
						<section key={section.title} className="space-y-3">
							<h2 className="text-[18px] font-bold tracking-widest text-slate-950 dark:text-slate-50">
								{section.title}
							</h2>
							<div className="space-y-3">
								{section.paragraphs.map((paragraph) => (
									<p
										key={`${section.title}-${paragraph}`}
										className="text-[15px] leading-7 tracking-wide text-slate-600 dark:text-slate-300"
									>
										{paragraph}
									</p>
								))}
							</div>
						</section>
					))}
				</article>
			</div>
		</div>
	);
}
