import { Sparkles } from "lucide-react";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import { cn } from "@/lib/utils";
import { CreateDeveloperNoteForm } from "./components/CreateDeveloperNoteForm";
import { getDeveloperNotes } from "./lib/getDeveloperNotes";
import { DEVELOPER_NOTE_STATUS_META } from "./lib/meta";

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
							今やっていること、今後やりたいことなどをまとめた開発ロードマップです。
						</p>
					</div>
				</div>
			</section>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
				<div className="mx-auto max-w-3xl space-y-12">
					{canCreate ? <CreateDeveloperNoteForm /> : null}

					<section
						id="developer-notes"
						className="scroll-mt-[calc(var(--header-height,0px)+1rem)]"
					>
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

							{notes.map((note, index) => {
								const meta = DEVELOPER_NOTE_STATUS_META[note.status];

								return (
									<article
										key={note.id}
										className="grid grid-cols-[22px_minmax(0,1fr)] gap-3 sm:grid-cols-[112px_28px_minmax(0,1fr)] sm:gap-8"
									>
										<div className="hidden space-y-3 pt-1 sm:block">
											<span
												className={cn(
													"inline-flex min-w-[78px] items-center justify-center rounded-lg px-4 py-2 text-[13px] font-black tracking-[0.16em]",
													meta.badgeClass,
												)}
											>
												{meta.label}
											</span>
											<time className="block text-[12px] font-medium tracking-[0.1em] text-slate-400 dark:text-slate-500">
												{formatDottedDate(note.createdAt)}
											</time>
											<p className="text-[12px] text-slate-400 dark:text-slate-500">
												{note.author.name}
											</p>
										</div>

										<div className="relative flex justify-center">
											<Sparkles className="h-4 w-4 shrink-0 fill-current text-amber-400 sm:h-5 sm:w-5" />
											{index < notes.length - 1 ? (
												<span className="absolute top-6 bottom-[-3rem] w-px bg-slate-200 dark:bg-slate-800 sm:top-7 sm:bottom-[-3.2rem]" />
											) : null}
										</div>

										<div className="pt-0.5">
											<div className="space-y-4">
												<div className="flex flex-wrap items-center gap-3 sm:hidden">
													<span
														className={cn(
															"inline-flex min-w-[64px] items-center justify-center rounded-lg px-3 py-1.5 text-[12px] font-bold tracking-[0.12em]",
															meta.badgeClass,
														)}
													>
														{meta.label}
													</span>
													<time className="text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
														{formatDottedDate(note.createdAt)}
													</time>
													<span className="text-[12px] text-slate-400 dark:text-slate-500">
														{note.author.name}
													</span>
												</div>
												<p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-700 dark:text-slate-200">
													{note.content}
												</p>
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
