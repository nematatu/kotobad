import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { BwfMatchSummary } from "../lib/types";
import { formatMatchTime } from "../lib/utils";
import { BwfScoreSide } from "./BwfScoreSide";
import { BwfTeamBlock } from "./BwfTeamBlock";

export function BwfMatchCard({
	match,
	showTournament = true,
}: {
	match: BwfMatchSummary;
	showTournament?: boolean;
}) {
	const [h2hOpen, setH2hOpen] = useState(false);
	const isLive = match.eventType === "live";
	const isScheduled = match.eventType === "scheduled";
	const isCompleted = match.eventType === "completed";

	const scores = match.scores ?? [];
	const lastScore = scores.at(-1);

	return (
		<article className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
			{/* Top Header Row */}
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/80">
				<div className="flex flex-wrap items-center gap-2">
					{showTournament && match.tournamentName ? (
						<span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[280px]">
							{match.tournamentName}
						</span>
					) : null}
					{match.tournamentCategory ? (
						<span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
							{match.tournamentCategory}
						</span>
					) : null}
					{match.displayRound ? (
						<span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
							{match.displayRound}
						</span>
					) : null}
					{match.displayCourt ? (
						<span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
							{match.displayCourt}
						</span>
					) : null}
				</div>

				{/* Status Badge */}
				<div className="flex items-center gap-1.5">
					{isLive ? (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-[12px] font-black tracking-wide text-white shadow-xs">
							<span className="h-2 w-2 rounded-full bg-white animate-ping" />
							ライブ中
						</span>
					) : isScheduled ? (
						<span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[12px] font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
							開始予定 {formatMatchTime(match.startTime)}
						</span>
					) : (
						<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
							試合終了
						</span>
					)}
				</div>
			</div>

			{/* Center Matchup Area */}
			<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 py-5">
				{/* Left Team */}
				<BwfTeamBlock team={match.teams[0]} side="left" />

				{/* Score / Center Versus */}
				<div className="flex flex-col items-center justify-center min-w-[90px] sm:min-w-[120px] px-1 text-center">
					{isLive && scores.length > 0 ? (
						<>
							<span className="text-[11px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500">
								GAME {scores.length}
							</span>
							<div className="mt-1 flex items-baseline justify-center gap-2">
								<BwfScoreSide
									sideIndex={1}
									score={lastScore?.team1}
									serving={lastScore?.servingTeam === 1}
									changed={match.scoreChangedTeam === 1}
								/>
								<span className="text-xl font-bold text-slate-300 dark:text-slate-600">
									-
								</span>
								<BwfScoreSide
									sideIndex={2}
									score={lastScore?.team2}
									serving={lastScore?.servingTeam === 2}
									changed={match.scoreChangedTeam === 2}
								/>
							</div>
						</>
					) : isCompleted && scores.length > 0 ? (
						<div className="flex flex-col items-center">
							<span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
								FINAL
							</span>
							<div className="mt-1 flex items-baseline justify-center gap-1.5 text-2xl font-black text-slate-800 dark:text-slate-100">
								<span>
									{match.scores.filter((s) => s.team1 > s.team2).length}
								</span>
								<span className="text-slate-300 dark:text-slate-600 text-lg">
									-
								</span>
								<span>
									{match.scores.filter((s) => s.team2 > s.team1).length}
								</span>
							</div>
						</div>
					) : (
						<span className="text-xl font-black italic tracking-wider text-slate-300 dark:text-slate-600">
							VS
						</span>
					)}
				</div>

				{/* Right Team */}
				<BwfTeamBlock team={match.teams[1]} side="right" />
			</div>

			{/* Set Scores Bar */}
			{scores.length > 0 ? (
				<div className="mt-2 flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
					{scores.map((s) => {
						const isTeam1Winner = s.team1 > s.team2;
						const isTeam2Winner = s.team2 > s.team1;
						return (
							<div
								key={s.game}
								className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/60"
							>
								<span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500">
									SET {s.game}
								</span>
								<div className="text-[13px] font-extrabold tabular-nums">
									<span
										className={
											isTeam1Winner
												? "text-slate-900 font-black dark:text-slate-50"
												: "text-slate-500 dark:text-slate-400"
										}
									>
										{s.team1}
									</span>
									<span className="mx-1 text-slate-300 dark:text-slate-600">
										-
									</span>
									<span
										className={
											isTeam2Winner
												? "text-slate-900 font-black dark:text-slate-50"
												: "text-slate-500 dark:text-slate-400"
										}
									>
										{s.team2}
									</span>
								</div>
							</div>
						);
					})}
					{match.durationMinutes ? (
						<span className="ml-auto text-[11px] font-medium text-slate-400 dark:text-slate-500">
							試合時間: {match.durationMinutes}分
						</span>
					) : null}
				</div>
			) : null}

			{/* Head to Head (H2H) Accordion */}
			{match.h2h ? (
				<div className="mt-3 border-t border-dashed border-slate-200 pt-2 dark:border-slate-800">
					<button
						type="button"
						onClick={() => setH2hOpen((prev) => !prev)}
						className="flex w-full items-center justify-between py-1 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
					>
						<span>
							対戦成績: {match.h2h.team1Wins}勝 - {match.h2h.team2Wins}勝
						</span>
						<ChevronDown
							className={`h-4 w-4 transition-transform duration-200 ${
								h2hOpen ? "rotate-180" : ""
							}`}
						/>
					</button>

					{h2hOpen && match.h2h.previousMeeting ? (
						<div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-950/40 dark:text-slate-400">
							<p className="font-semibold text-slate-700 dark:text-slate-300">
								前回対戦: {match.h2h.previousMeeting.tournament} (
								{match.h2h.previousMeeting.round})
							</p>
							<p className="mt-1">
								勝者:{" "}
								{match.h2h.previousMeeting.winner === 1
									? match.teams[0].players.map((p) => p.name).join("/")
									: match.teams[1].players.map((p) => p.name).join("/")}{" "}
								/ スコア: {match.h2h.previousMeeting.score}
							</p>
						</div>
					) : null}
				</div>
			) : null}
		</article>
	);
}
