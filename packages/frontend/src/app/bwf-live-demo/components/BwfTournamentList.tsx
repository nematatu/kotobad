import { ExternalLink } from "lucide-react";
import type { BwfTournamentSummary } from "../lib/types";

export function BwfTournamentList({
	tournaments,
	onSelectTournament,
}: {
	tournaments: BwfTournamentSummary[];
	onSelectTournament?: (id: string) => void;
}) {
	if (tournaments.length === 0) {
		return (
			<div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
				<p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
					現在開催中の大会情報はありません。
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{tournaments.map((t) => (
				<article
					key={t.id}
					className="flex flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900"
				>
					<div>
						<div className="flex items-start justify-between gap-3">
							<div className="flex flex-wrap items-center gap-2">
								{t.categoryName ? (
									<span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-black text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
										{t.categoryName}
									</span>
								) : null}
								{t.liveCount > 0 ? (
									<span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
										<span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
										ライブ中: {t.liveCount}試合
									</span>
								) : null}
							</div>

							{t.link ? (
								<a
									href={t.link}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
								>
									<span>詳細</span>
									<ExternalLink className="h-3 w-3" />
								</a>
							) : null}
						</div>

						<h3 className="mt-3 text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
							{t.name}
						</h3>

						<div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
							{t.date ? <p>日程: {t.date}</p> : null}
							{t.venueName ? <p>会場: {t.venueName}</p> : null}
						</div>
					</div>

					<div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
						<span className="text-slate-400 dark:text-slate-500">
							総試合数: {t.matchCount}試合
						</span>
						{onSelectTournament ? (
							<button
								type="button"
								onClick={() => onSelectTournament(t.id)}
								className="font-bold text-blue-600 hover:underline dark:text-blue-400"
							>
								この大会の試合を見る →
							</button>
						) : null}
					</div>
				</article>
			))}
		</div>
	);
}
