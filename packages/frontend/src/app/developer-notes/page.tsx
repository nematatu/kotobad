import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import { CreateDeveloperNoteForm } from "./components/CreateDeveloperNoteForm";
import { DeveloperNoteTimeline } from "./components/DeveloperNoteTimeline";
import { DeveloperRoadmapList } from "./components/DeveloperRoadmapList";
import { getDeveloperNotes } from "./lib/getDeveloperNotes";
import { getDeveloperRoadmap } from "./lib/getDeveloperRoadmap";

export const dynamic = "force-dynamic";

export default async function DeveloperNotesPage() {
	const [{ notes, labels, canCreate }, roadmapItems] = await Promise.all([
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
						<div className="rounded-[28px] bg-[#ebf6ff] px-4 py-6 sm:rounded-[36px] sm:px-8 sm:py-10 dark:border dark:border-slate-800 dark:bg-slate-900/80">
							<div className="max-w-2xl">
								<h2 className="text-[19px] font-bold tracking-tight text-[#080d12] dark:text-slate-50 sm:text-[21px]">
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

							<DeveloperNoteTimeline
								notes={notes}
								labels={labels}
								canEdit={canCreate}
							/>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
