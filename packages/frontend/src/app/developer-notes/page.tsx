import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { CreateDeveloperNoteForm } from "./components/CreateDeveloperNoteForm";
import { DeveloperRoadmapList } from "./components/DeveloperRoadmapList";
import { getDeveloperNotes } from "./lib/getDeveloperNotes";
import { getDeveloperRoadmap } from "./lib/getDeveloperRoadmap";

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
	const [{ notes, canCreate }, roadmapItems] = await Promise.all([
		getDeveloperNotes(),
		getDeveloperRoadmap(),
	]);

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
							開発中に考えたこと、次やることなど
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
						<div className="rounded-[36px] bg-[#ebf6ff] px-5 py-8 sm:px-8 sm:py-10 dark:border dark:border-slate-800 dark:bg-slate-900/80">
							<div className="max-w-2xl space-y-2">
								<h2 className="text-[21px] font-bold tracking-tight text-[#080d12] dark:text-slate-50">
									ロードマップ
								</h2>
							</div>

							<DeveloperRoadmapList items={roadmapItems} canEdit={canCreate} />
						</div>
					</section>

					<section
						id="developer-notes"
						className="scroll-mt-[calc(var(--header-height,0px)+1rem)]"
					>
						<div className="mb-8 border-b border-slate-200" />
						<div className="mx-auto max-w-3xl space-y-10 sm:space-y-12">
							{canCreate ? <CreateDeveloperNoteForm /> : null}

							<div className="space-y-10 sm:space-y-12">
								{notes.length === 0 ? (
									<section className="rounded-[28px] border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
										<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
											EMPTY
										</p>
										<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
											まだボヤキはありません。
										</p>
									</section>
								) : null}

								{notes.map((note) => {
									return (
										<article
											key={note.id}
											className="flex items-start gap-3 sm:gap-4"
										>
											<div className="pt-1">
												<AuthorAvatar
													name={note.author.name}
													image={note.author.image}
													className="h-11 w-11 border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
													fallbackClassName="bg-sky-500 text-sm font-black text-white"
												/>
											</div>

											<div className="min-w-0 flex-1">
												<div className="relative max-w-[44rem] rounded-[24px] bg-white px-5 py-4 sm:px-6 sm:py-5 dark:bg-slate-900">
													<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
														<p className="text-[13px] font-bold tracking-[0.06em] text-slate-700 dark:text-slate-200">
															{note.author.name}
														</p>
														<time className="text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
															{formatDottedDate(note.createdAt)}
														</time>
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
