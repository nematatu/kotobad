"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import { cn } from "@/lib/utils";
import {
	type BwfLiveMatch,
	getBwfCurrentLiveTournaments,
} from "./lib/getBwfLiveMatches";

const EVENT_LABELS: Record<string, string> = {
	MS: "男子シングルス",
	WS: "女子シングルス",
	MD: "男子ダブルス",
	WD: "女子ダブルス",
	XD: "混合ダブルス",
};

const MATCH_STATE_STYLES: Record<string, string> = {
	P: "bg-rose-500 text-white",
	C: "bg-amber-400 text-slate-950",
};

const formatDateTime = (value: string) => {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat("ja-JP", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date);
};

const getEventLabel = (value: string | null) =>
	value ? (EVENT_LABELS[value] ?? value) : "種目未設定";

const getCountryText = (codes: string[]) =>
	codes.length > 0 ? codes.join(" / ") : "国籍未設定";

const renderTeamName = (
	name: string,
	playerLinks: string[],
	countryText: string,
) => {
	if (playerLinks.length > 0) {
		return (
			<a
				href={playerLinks[0]}
				target="_blank"
				rel="noreferrer"
				className="block min-w-0"
			>
				<p className="truncate text-[15px] font-bold text-slate-950 underline decoration-slate-200 underline-offset-4 dark:text-slate-50 dark:decoration-slate-700">
					{name}
				</p>
				<p className="mt-1 text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
					{countryText}
				</p>
			</a>
		);
	}

	return (
		<div className="min-w-0">
			<p className="truncate text-[15px] font-bold text-slate-950 dark:text-slate-50">
				{name}
			</p>
			<p className="mt-1 text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
				{countryText}
			</p>
		</div>
	);
};

const renderGames = (match: BwfLiveMatch) => {
	if (match.games.length === 0) {
		return (
			<p className="text-[13px] text-slate-400 dark:text-slate-500">
				スコアはまだ入っていません。
			</p>
		);
	}

	return (
		<div className="grid grid-cols-3 gap-2">
			{match.games.map((game) => (
				<div
					key={game.label}
					className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center dark:border-slate-800 dark:bg-slate-950/70"
				>
					<p className="text-[10px] font-black tracking-[0.18em] text-slate-400 dark:text-slate-600">
						{game.label}
					</p>
					<p className="mt-1 text-[15px] font-black text-slate-800 dark:text-slate-100">
						{game.team1 ?? "-"} - {game.team2 ?? "-"}
					</p>
				</div>
			))}
		</div>
	);
};

export default function BwfLiveDemoPage() {
	const searchParams = useSearchParams();
	const focusedTournamentId = searchParams.get("tmtId");
	const { data: result } = useSWR(
		["bwf-current-live-tournaments"],
		() => getBwfCurrentLiveTournaments(),
		{
			keepPreviousData: true,
			refreshInterval: 10_000,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		},
	);
	const tournamentSections =
		result?.ok && focusedTournamentId
			? result.tournaments.filter(
					(section) => section.tournament.id === focusedTournamentId,
				)
			: result?.ok
				? result.tournaments
				: [];

	return (
		<div className="relative min-h-screen bg-[#f8fbff] dark:bg-[#0f172a]">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-24 z-0 rotate-[-10deg] opacity-15 sm:bottom-12"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>

			<section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
				<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 sm:pt-26">
					<div className="mx-auto max-w-3xl space-y-4 text-center sm:space-y-5">
						<h1 className="text-2xl font-black tracking-[0.1em] text-slate-950 dark:text-slate-50 sm:text-4xl">
							BWFライブ試合デモ
						</h1>
						<p className="text-[15px] leading-8 text-slate-500 dark:text-slate-300">
							BWF 公式 match-centre の current live / live matches
							を使った一覧表示デモです。
						</p>
						<p className="text-[12px] tracking-[0.08em] text-slate-400 dark:text-slate-500">
							対象大会: {result?.ok ? tournamentSections.length : "-"}
							{focusedTournamentId ? ` / 絞り込み: ${focusedTournamentId}` : ""}
							{result?.ok
								? ` / 更新: ${formatDateTime(result.fetchedAt)} JST`
								: ""}
						</p>
					</div>
				</div>
			</section>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
				{!result ? (
					<section className="mx-auto max-w-3xl rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
						<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
							LOADING
						</p>
						<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
							BWF 公式 live matches API を取得しています。
						</p>
					</section>
				) : !result.ok ? (
					<section className="mx-auto max-w-3xl rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
						<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
							UNAVAILABLE
						</p>
						<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
							{result.message}
						</p>
					</section>
				) : tournamentSections.length === 0 ? (
					<section className="mx-auto max-w-3xl rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
						<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
							EMPTY
						</p>
						<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
							現在ライブ表示中の大会は見つかりませんでした。
						</p>
					</section>
				) : (
					<div className="space-y-6">
						{tournamentSections.map((section) => (
							<section key={section.tournament.id} className="space-y-4">
								<div className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900">
									<div className="flex flex-wrap items-start justify-between gap-4">
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
												<h2 className="text-[22px] font-black tracking-tight text-slate-950 dark:text-slate-50">
													{section.tournament.name}
												</h2>
												{section.tournament.categoryName ? (
													<span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
														{section.tournament.categoryName}
													</span>
												) : null}
											</div>
											<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500 dark:text-slate-400">
												{section.tournament.date ? (
													<span>{section.tournament.date}</span>
												) : null}
												{section.tournament.venueName ? (
													<span>{section.tournament.venueName}</span>
												) : null}
												<span>ID: {section.tournament.id}</span>
											</div>
										</div>
										<div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
											{section.ok ? (
												<>
													<span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
														ライブ試合:{" "}
														{section.liveCount ?? section.matches.length}
													</span>
													{section.matchCount !== null ? (
														<span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
															大会全体: {section.matchCount}
														</span>
													) : null}
												</>
											) : null}
											{section.tournament.link ? (
												<a
													href={section.tournament.link}
													target="_blank"
													rel="noreferrer"
													className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
												>
													公式ページ
												</a>
											) : null}
										</div>
									</div>
								</div>

								{section.ok ? (
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
										{section.matches.map((match) => (
											<article
												key={`${section.tournament.id}-${match.liveId}-${match.matchId}`}
												className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900"
											>
												<div className="flex items-start justify-between gap-3">
													<div className="min-w-0">
														<p className="text-[11px] font-bold tracking-[0.12em] text-slate-400 dark:text-slate-500">
															{getEventLabel(match.event)}
														</p>
														<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500 dark:text-slate-400">
															{match.round ? <span>{match.round}</span> : null}
															{match.courtName ? (
																<span>{match.courtName}</span>
															) : null}
														</div>
													</div>
													<span
														className={cn(
															"inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold tracking-[0.08em]",
															MATCH_STATE_STYLES[match.status] ??
																"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
														)}
													>
														{match.statusLabel}
													</span>
												</div>

												<div className="mt-5 space-y-3">
													<div className="flex items-start justify-between gap-4">
														{renderTeamName(
															match.team1Name,
															match.team1PlayerLinks,
															getCountryText(match.team1Countries),
														)}
													</div>
													<div className="flex items-start justify-between gap-4">
														{renderTeamName(
															match.team2Name,
															match.team2PlayerLinks,
															getCountryText(match.team2Countries),
														)}
													</div>
												</div>

												<div className="mt-5">{renderGames(match)}</div>

												<div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400">
													<span>Match #{match.code}</span>
													{match.durationMinutes !== null ? (
														<span>{match.durationMinutes} 分</span>
													) : null}
												</div>
											</article>
										))}
									</div>
								) : (
									<section className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-900/60">
										<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
											UNAVAILABLE
										</p>
										<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
											{section.message}
										</p>
									</section>
								)}
							</section>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
