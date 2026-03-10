import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import ActionLink from "@/components/common/button/ActionLink";
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
			<ActionLink
				item={{
					label: "更新情報へ戻る",
					href: "/updates",
					icon: () => <ArrowLeft className="h-4 w-4" />,
				}}
				variant="menu"
				className="absolute left-4 top-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 "
			></ActionLink>
			<section
				id="overview"
				className="relative mx-auto w-full max-w-3xl overflow-hidden border-b border-slate-200/80 scroll-mt-[calc(var(--header-height,0px)+1rem)]"
			>
				<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 sm:pt-26">
					<div className="mx-auto max-w-3xl space-y-4 text-center sm:space-y-5">
						<h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
							{update.title}
						</h1>
					</div>
				</div>
			</section>
			<div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
				<div className="flex flex-wrap pl-3 items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-300">
					<span>{update.date}</span>
					<span
						className={cn(
							"inline-flex min-w-[50px] items-center justify-center rounded-lg text-[14px] px-2 py-1 font-bold",
							UPDATE_TIMELINE_BADGE_CLASS[update.category],
						)}
					>
						{meta.label}
					</span>
				</div>
				<article className="mt-6 space-y-8 rounded-[28px] bg-white px-5 py-6  dark:bg-slate-900 sm:px-8 sm:py-8">
					{update.detailPage.sections.map((section) => (
						<section key={section.title} className="space-y-3">
							<h2 className="text-[18px] font-bold tracking-tight text-slate-950 dark:text-slate-50">
								{section.title}
							</h2>
							<div className="space-y-3">
								{section.paragraphs.map((paragraph) => (
									<p
										key={`${section.title}-${paragraph}`}
										className="text-[15px] leading-7 text-slate-600 dark:text-slate-300"
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
