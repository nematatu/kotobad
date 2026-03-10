import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { cn } from "@/lib/utils";
import { CreateDeveloperNoteForm } from "./components/CreateDeveloperNoteForm";
import { getDeveloperNotes } from "./lib/getDeveloperNotes";
import {
	DEVELOPER_NOTE_KIND_META,
	DEVELOPER_NOTE_STATUS_META,
} from "./lib/meta";
import { DEVELOPER_NOTE_ROADMAP_ITEMS } from "./lib/roadmap";

export const dynamic = "force-dynamic";

const formatDottedDate = (value: string) => {
	const formatter = new Intl.DateTimeFormat("ja-JP", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return formatter.format(date).replaceAll("/", ".");
};

const ROADMAP_CARD_CLASS = {
	wip: "bg-[#ffffff] text-[#6f767a]",
	todo: "bg-[#ffffff] text-[#6f767a]",
	done: "bg-[rgba(255,255,255,0.68)] text-[#6f767a] [background-image:repeating-linear-gradient(-45deg,rgba(255,255,255,0.75)_0,rgba(255,255,255,0.75)_6px,transparent_6px,transparent_12px)]",
} as const;

const ROADMAP_FLOATING_BADGE_META = {
	wip: {
		label: "WIP",
		className: "-top-4 right-3 rotate-[4deg] bg-[#ffffff] text-[#32a8f8]",
	},
	todo: {
		label: "todo",
		className: "-bottom-4 right-3 bg-[#b1bec6] text-white",
	},
	done: {
		label: "done",
		className: "-bottom-4 right-3 bg-[#b1bec6] text-white",
	},
} as const;

export default async function DeveloperNotesPage() {
	const { notes, canCreate } = await getDeveloperNotes();

	return (
		<div className="relative min-h-screen bg-[#f8fbff] dark:bg-[#0f172a]">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-24 z-0 rotate-[-10deg] opacity-15 sm:bottom-12"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>

			<section className="relative overflow-hidden border-b border-slate-200/80">
				<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 sm:pt-26">
					<div className="mx-auto max-w-3xl space-y-5 text-center">
						<h1 className="text-2xl font-black tracking-[0.12em] text-slate-950 dark:text-slate-50 sm:text-4xl">
							開発者のボヤキ
						</h1>
						<p className="text-[15px] leading-8 text-slate-500 dark:text-slate-300">
							今作っているもの、次に手を付けたいもの、途中で考えたことを、そのまま積んでいくページです。
						</p>
					</div>
				</div>
			</section>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
				<div className="space-y-14 sm:space-y-16">
					<section
						id="roadmap"
						className="scroll-mt-[calc(var(--header-height,0px)+1rem)]"
					>
						<div className="rounded-[36px] bg-[#ebf6ff] px-5 py-8 sm:px-8 sm:py-10 dark:bg-[#ebf6ff]">
							<div className="max-w-2xl space-y-2">
								<h2 className="text-[21px] font-bold tracking-tight text-[#080d12] dark:text-[#080d12]">
									ロードマップ
								</h2>
							</div>

							<div className="mt-6 flex flex-wrap items-start gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-7">
								{DEVELOPER_NOTE_ROADMAP_ITEMS.map((item) => {
									const badgeMeta = ROADMAP_FLOATING_BADGE_META[item.status];

									return (
										<article
											key={`${item.status}-${item.title}`}
											title={item.summary}
											className={cn(
												"relative rounded-[12px] px-5 py-3 shadow-none",
												ROADMAP_CARD_CLASS[item.status],
											)}
										>
											<h3 className="text-[15px] leading-[1.45] font-normal tracking-tight text-inherit">
												{item.title}
											</h3>
											<span
												className={cn(
													"absolute inline-flex rounded-[11px] px-[10px] py-[4px] text-[11px] font-bold tracking-[0.04em]",
													badgeMeta.className,
												)}
											>
												{badgeMeta.label}
											</span>
										</article>
									);
								})}
							</div>
						</div>
					</section>

					<section
						id="developer-notes"
						className="scroll-mt-[calc(var(--header-height,0px)+1rem)]"
					>
						<div className="mx-auto max-w-3xl space-y-10 sm:space-y-12">
							<h2 className="text-[24px] font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-[30px]">
								下では、開発者がそのまま喋っている形で並べます
							</h2>

							{canCreate ? <CreateDeveloperNoteForm /> : null}

							<div className="space-y-10 sm:space-y-12">
								{notes.length === 0 ? (
									<section className="rounded-[28px] border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center shadow-[0_12px_26px_rgba(148,163,184,0.1)] dark:border-slate-700 dark:bg-slate-900/50">
										<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
											EMPTY
										</p>
										<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
											まだボヤキはありません。
										</p>
									</section>
								) : null}

								{notes.map((note) => {
									const statusMeta = DEVELOPER_NOTE_STATUS_META[note.status];
									const kindMeta = DEVELOPER_NOTE_KIND_META[note.kind];

									return (
										<article
											key={note.id}
											className="flex items-start gap-3 sm:gap-4"
										>
											<div className="pt-1">
												<AuthorAvatar
													name={note.author.name}
													image={note.author.image}
													className="h-11 w-11 border border-slate-200 bg-white shadow-[0_10px_24px_rgba(148,163,184,0.18)] dark:border-slate-700 dark:bg-slate-900"
													fallbackClassName="bg-sky-500 text-sm font-black text-white"
												/>
											</div>

											<div className="min-w-0 flex-1">
												<div className="relative max-w-[44rem] rounded-[24px] bg-white px-5 py-4 shadow-[0_14px_30px_rgba(148,163,184,0.14)] before:absolute before:top-5 before:left-[-6px] before:h-4 before:w-4 before:rotate-45 before:bg-white before:content-[''] sm:px-6 sm:py-5 dark:bg-slate-900 dark:before:bg-slate-900">
													<div className="flex flex-wrap items-center gap-2">
														<span
															className={cn(
																"inline-flex rounded-full border px-3 py-1 text-[11px] font-black tracking-[0.12em]",
																kindMeta.badgeClass,
															)}
														>
															{kindMeta.label}
														</span>
														<span
															className={cn(
																"inline-flex min-w-[72px] items-center justify-center rounded-lg px-3 py-1.5 text-[12px] font-bold tracking-[0.12em]",
																statusMeta.badgeClass,
															)}
														>
															{statusMeta.label}
														</span>
														<time className="text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
															{formatDottedDate(note.createdAt)}
														</time>
														<span className="text-[12px] text-slate-400 dark:text-slate-500">
															{note.author.name}
														</span>
													</div>
													<p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-700 dark:text-slate-200">
														{note.content}
													</p>
												</div>
											</div>
										</article>
									);
								})}
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
