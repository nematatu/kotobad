import type { BwfPlayerSummary, BwfTeamSummary } from "../lib/types";
import { displayCountry, playerInitial } from "../lib/utils";

export function BwfTeamBlock({
	team,
	side,
}: {
	team: BwfTeamSummary | undefined;
	side: "left" | "right";
}) {
	const players = team?.players ?? [];
	const isJapanese = team?.isJapanese || players.some((p) => p.isJapanese);

	return (
		<div
			className={`flex flex-col min-w-0 ${
				side === "left" ? "text-right items-end" : "text-left items-start"
			}`}
		>
			{/* Team Identity: Flag + Player Photos */}
			<div className="flex flex-col items-center justify-center gap-1.5 w-full">
				<div className="flex items-center gap-2">
					{players.map((p: BwfPlayerSummary) =>
						p.photoUrl ? (
							// biome-ignore lint/performance/noImgElement: external BWF player avatar
							<img
								key={p.id ?? p.originalName}
								className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 object-cover object-top shadow-xs"
								src={p.photoUrl}
								alt={p.name}
							/>
						) : (
							<div
								key={p.id ?? p.originalName}
								className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300 shadow-xs"
							>
								{playerInitial(p.name)}
							</div>
						),
					)}
				</div>

				{/* Country Flag & Label */}
				<div className="flex items-center gap-1.5 mt-0.5">
					{team?.flagUrl ? (
						// biome-ignore lint/performance/noImgElement: external BWF country flag
						<img
							className="h-4 w-6 object-cover rounded-xs border border-slate-200 dark:border-slate-700"
							src={team.flagUrl}
							alt={team.countryCode || "国旗"}
						/>
					) : (
						<span className="inline-block rounded-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
							{team?.countryCode || "JPN"}
						</span>
					)}
					<span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
						{displayCountry(team?.countryCode)}
					</span>
				</div>
			</div>

			{/* Player Names */}
			<div
				className={`mt-2.5 flex flex-wrap items-baseline gap-1 w-full justify-center ${
					isJapanese ? "font-bold" : "font-medium"
				}`}
			>
				{players.map((p: BwfPlayerSummary, idx: number) => (
					<span
						key={p.id ?? p.originalName}
						className="inline-flex items-center"
					>
						{idx > 0 ? (
							<span className="mx-1 text-slate-400 dark:text-slate-600 text-xs">
								/
							</span>
						) : null}
						<span
							className={`text-[15px] sm:text-[17px] leading-tight ${
								p.isJapanese
									? "text-slate-950 dark:text-slate-50 underline decoration-[#ffe24a] decoration-[0.25em] underline-offset-[-0.1em]"
									: "text-slate-700 dark:text-slate-200"
							}`}
							title={p.originalName}
						>
							{p.name}
						</span>
					</span>
				))}
			</div>
		</div>
	);
}
