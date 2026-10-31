"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
import { BwfMatchCard } from "./components/BwfMatchCard";
import { BwfMatchToolbar, type BwfViewTab } from "./components/BwfMatchToolbar";
import { BwfTournamentList } from "./components/BwfTournamentList";
import {
	DEMO_TOURNAMENTS,
	INITIAL_DEMO_MATCHES,
	stepDemoLiveMatchScores,
} from "./lib/demoMatches";
import { fetchBwfLiveFeed } from "./lib/getBwfLiveMatches";
import type {
	BwfMatchSummary,
	BwfSortOrder,
	BwfTournamentSummary,
} from "./lib/types";
import { formatFullDateTime } from "./lib/utils";

const BwfLiveDemoLoading = () => (
	<section className="mx-auto max-w-3xl rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/60">
		<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
		<p className="text-[12px] font-black tracking-[0.25em] text-slate-400 dark:text-slate-500">
			BWF LIVE SCORE DEMO
		</p>
		<p className="mt-2 text-[15px] font-semibold text-slate-700 dark:text-slate-300">
			BWF ライブスコアを取得しています…
		</p>
	</section>
);

function BwfLiveDemoContent() {
	const searchParams = useSearchParams();
	const defaultTabParam = searchParams.get("tab") as BwfViewTab | null;

	const [currentTab, setCurrentTab] = useState<BwfViewTab>(
		defaultTabParam || "live",
	);
	const [filterJapaneseOnly, setFilterJapaneseOnly] = useState(false);
	const [sortOrder, setSortOrder] = useState<BwfSortOrder>("court");
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [forcedDemoMode, setForcedDemoMode] = useState(false);
	const [demoMatches, setDemoMatches] =
		useState<BwfMatchSummary[]>(INITIAL_DEMO_MATCHES);

	const {
		data: feedResult,
		isValidating,
		mutate,
	} = useSWR(["bwf-live-feed"], () => fetchBwfLiveFeed(), {
		keepPreviousData: true,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		refreshInterval: autoRefresh && !forcedDemoMode ? 15_000 : 0,
	});

	// If forced demo mode is active or feed failed/empty, we use demo matches
	const isDemo = forcedDemoMode || (feedResult ? feedResult.isFallback : false);
	const activeMatches: BwfMatchSummary[] = isDemo
		? demoMatches
		: feedResult?.matches || [];
	const activeTournaments: BwfTournamentSummary[] = isDemo
		? DEMO_TOURNAMENTS
		: feedResult?.tournaments || [];

	// Simulate score progression in demo mode when autoRefresh is enabled
	useEffect(() => {
		if (!autoRefresh || !isDemo) return;

		const timer = setInterval(() => {
			setDemoMatches((prev) => stepDemoLiveMatchScores(prev));
		}, 12_000);

		return () => clearInterval(timer);
	}, [autoRefresh, isDemo]);

	// Counts
	const liveCount = useMemo(
		() => activeMatches.filter((m) => m.eventType === "live").length,
		[activeMatches],
	);
	const scheduledCount = useMemo(
		() => activeMatches.filter((m) => m.eventType === "scheduled").length,
		[activeMatches],
	);
	const completedCount = useMemo(
		() => activeMatches.filter((m) => m.eventType === "completed").length,
		[activeMatches],
	);

	// Filtering
	const filteredMatches = useMemo(() => {
		let list = activeMatches.filter((m) => m.eventType === currentTab);
		if (filterJapaneseOnly) {
			list = list.filter((m) => m.hasJapanesePlayer);
		}

		return [...list].sort((a, b) => {
			if (sortOrder === "court") {
				const cA = Number.parseInt(a.court?.replace(/\D/g, "") || "99", 10);
				const cB = Number.parseInt(b.court?.replace(/\D/g, "") || "99", 10);
				return cA - cB;
			}
			if (sortOrder === "time-asc") {
				return (a.startTime || "").localeCompare(b.startTime || "");
			}
			if (sortOrder === "time-desc") {
				return (b.startTime || "").localeCompare(a.startTime || "");
			}
			return 0;
		});
	}, [activeMatches, currentTab, filterJapaneseOnly, sortOrder]);

	const handleRefresh = async () => {
		if (isDemo) {
			setDemoMatches((prev) => stepDemoLiveMatchScores(prev));
		} else {
			await mutate();
		}
	};

	const handleToggleDataSource = () => {
		setForcedDemoMode((prev) => !prev);
	};

	return (
		<div className="relative min-h-screen bg-[#f8fbff] text-slate-900 dark:bg-[#0f172a] dark:text-slate-100">
			{/* Decorative Logo Sticker */}
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-24 z-0 rotate-[-10deg] opacity-15 sm:bottom-12"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>

			{/* Page Header */}
			<section className="relative overflow-hidden border-b border-slate-200/80 bg-gray-200/60 dark:border-slate-800 dark:bg-gray-800/60">
				<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 sm:pt-22">
					<div className="mx-auto max-w-3xl space-y-3 text-center sm:space-y-4">
						<div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
							<span>🏸 BWF ライブスコア</span>
							<span className="text-blue-300 dark:text-blue-700">|</span>
							<span>BWFNotify PWA 統合デモ</span>
						</div>

						<h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
							BWFライブ試合デモ
						</h1>

						<p className="text-[14px] sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
							BWF公式マッチセンターのリアルタイム速報を統合したライブスコア画面です。
							日本人選手の漢字表記・ハイライト、サーブ権インジケーター、ゲーム別スコアをリアルタイムでお届けします。
						</p>

						<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] font-medium text-slate-500 dark:text-slate-400 pt-1">
							<span>
								状態: {isDemo ? "デモ用スコアデータ" : "公式API接続中"}
							</span>
							<span>
								最終更新:{" "}
								{formatFullDateTime(
									feedResult?.fetchedAt || new Date().toISOString(),
								)}{" "}
								JST
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content Area */}
			<main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
				{!feedResult && !forcedDemoMode ? (
					<BwfLiveDemoLoading />
				) : (
					<div className="space-y-6">
						{/* Notice Banner if fallback */}
						{feedResult?.message ? (
							<div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs sm:text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 flex items-center justify-between gap-3">
								<p>
									<span className="font-bold">ℹ️ お知らせ: </span>
									{feedResult.message}
								</p>
							</div>
						) : null}

						{/* Toolbar (Tabs + Controls) */}
						<div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90">
							<BwfMatchToolbar
								currentTab={currentTab}
								onTabChange={setCurrentTab}
								liveCount={liveCount}
								scheduledCount={scheduledCount}
								completedCount={completedCount}
								tournamentsCount={activeTournaments.length}
								filterJapaneseOnly={filterJapaneseOnly}
								onFilterJapaneseChange={setFilterJapaneseOnly}
								sortOrder={sortOrder}
								onSortOrderChange={setSortOrder}
								autoRefresh={autoRefresh}
								onAutoRefreshChange={setAutoRefresh}
								onRefresh={handleRefresh}
								isRefreshing={isValidating}
								isFallbackData={isDemo}
								onToggleDataSource={handleToggleDataSource}
							/>
						</div>

						{/* Match Cards or Tournament List */}
						{currentTab === "tournaments" ? (
							<BwfTournamentList
								tournaments={activeTournaments}
								onSelectTournament={() => setCurrentTab("live")}
							/>
						) : filteredMatches.length === 0 ? (
							<section className="mx-auto max-w-2xl rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
								<p className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500">
									NO MATCHES
								</p>
								<p className="mt-3 text-[15px] font-semibold text-slate-600 dark:text-slate-300">
									{filterJapaneseOnly
										? "該当する日本人選手の試合はありません。"
										: "該当する試合はありません。"}
								</p>
								{filterJapaneseOnly ? (
									<button
										type="button"
										onClick={() => setFilterJapaneseOnly(false)}
										className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs dark:bg-white dark:text-slate-900"
									>
										すべての試合を表示する
									</button>
								) : null}
							</section>
						) : (
							<div className="grid gap-4 md:grid-cols-2">
								{filteredMatches.map((match) => (
									<BwfMatchCard key={match.id} match={match} />
								))}
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}

export default function BwfLiveDemoPage() {
	return (
		<Suspense fallback={<BwfLiveDemoLoading />}>
			<BwfLiveDemoContent />
		</Suspense>
	);
}
