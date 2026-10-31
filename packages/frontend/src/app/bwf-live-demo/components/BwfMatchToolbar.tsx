import { RefreshCw } from "lucide-react";
import type { BwfEventType, BwfSortOrder } from "../lib/types";

export type BwfViewTab = BwfEventType | "tournaments";

export function BwfMatchToolbar({
	currentTab,
	onTabChange,
	liveCount,
	scheduledCount,
	completedCount,
	tournamentsCount,
	filterJapaneseOnly,
	onFilterJapaneseChange,
	sortOrder,
	onSortOrderChange,
	autoRefresh,
	onAutoRefreshChange,
	onRefresh,
	isRefreshing,
	isFallbackData,
	onToggleDataSource,
}: {
	currentTab: BwfViewTab;
	onTabChange: (tab: BwfViewTab) => void;
	liveCount: number;
	scheduledCount: number;
	completedCount: number;
	tournamentsCount: number;
	filterJapaneseOnly: boolean;
	onFilterJapaneseChange: (val: boolean) => void;
	sortOrder: BwfSortOrder;
	onSortOrderChange: (order: BwfSortOrder) => void;
	autoRefresh: boolean;
	onAutoRefreshChange: (val: boolean) => void;
	onRefresh: () => void;
	isRefreshing: boolean;
	isFallbackData: boolean;
	onToggleDataSource: () => void;
}) {
	const tabs = [
		{
			id: "live" as BwfViewTab,
			label: "ライブ",
			count: liveCount,
			activeBadgeClass: "bg-rose-500 text-white",
		},
		{
			id: "scheduled" as BwfViewTab,
			label: "このあと",
			count: scheduledCount,
			activeBadgeClass: "bg-amber-500 text-white",
		},
		{
			id: "completed" as BwfViewTab,
			label: "結果",
			count: completedCount,
			activeBadgeClass: "bg-slate-700 text-white",
		},
		{
			id: "tournaments" as BwfViewTab,
			label: "大会一覧",
			count: tournamentsCount,
			activeBadgeClass: "bg-blue-600 text-white",
		},
	];

	return (
		<div className="space-y-4">
			{/* Top Bar: Tabs & Main Action Controls */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
				{/* Navigation Tabs */}
				<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
					{tabs.map((tab) => {
						const isActive = currentTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => onTabChange(tab.id)}
								className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
									isActive
										? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-950"
										: "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
								}`}
							>
								<span>{tab.label}</span>
								<span
									className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-black ${
										isActive
											? tab.activeBadgeClass
											: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
									}`}
								>
									{tab.count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Right: Refresh Controls & Data Source Badge */}
				<div className="flex items-center gap-2">
					{/* Auto-refresh toggle */}
					<button
						type="button"
						onClick={() => onAutoRefreshChange(!autoRefresh)}
						className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
							autoRefresh
								? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
								: "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
						}`}
						title="15秒ごとの自動更新切替"
					>
						<span
							className={`h-2 w-2 rounded-full ${
								autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
							}`}
						/>
						{autoRefresh ? "自動更新中 (15s)" : "自動更新オフ"}
					</button>

					{/* Manual Refresh Button */}
					<button
						type="button"
						onClick={onRefresh}
						disabled={isRefreshing}
						className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
						aria-label="スコア再取得"
						title="スコア再取得"
					>
						<RefreshCw
							className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
						/>
					</button>
				</div>
			</div>

			{/* Sub-toolbar: Filter & Sort */}
			{currentTab !== "tournaments" ? (
				<div className="flex flex-wrap items-center justify-between gap-3 text-xs">
					{/* Japanese filter button */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => onFilterJapaneseChange(!filterJapaneseOnly)}
							className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-bold transition ${
								filterJapaneseOnly
									? "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200"
									: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
							}`}
						>
							<span>🇯🇵</span>
							<span>日本人選手のみ</span>
							{filterJapaneseOnly ? (
								<span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">
									ON
								</span>
							) : null}
						</button>

						{/* Data mode switch button */}
						<button
							type="button"
							onClick={onToggleDataSource}
							className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
							title="デモデータ / 公式APIの切替"
						>
							<span
								className={`h-1.5 w-1.5 rounded-full ${
									isFallbackData ? "bg-amber-500" : "bg-emerald-500"
								}`}
							/>
							<span>
								{isFallbackData ? "デモデータ表示中" : "BWF公式データ"}
							</span>
						</button>
					</div>

					{/* Sort Dropdown */}
					<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
						<span>並び替え:</span>
						<select
							value={sortOrder}
							onChange={(e) =>
								onSortOrderChange(e.target.value as BwfSortOrder)
							}
							className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
						>
							<option value="court">コート順</option>
							<option value="time-asc">時間が早い順</option>
							<option value="time-desc">時間が遅い順</option>
						</select>
					</div>
				</div>
			) : null}
		</div>
	);
}
