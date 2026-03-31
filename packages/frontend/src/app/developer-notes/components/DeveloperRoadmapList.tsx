"use client";

import type {
	DeveloperRoadmapItemType,
	DeveloperRoadmapListType,
	DeveloperRoadmapStatusType,
	UpdateDeveloperRoadmapItemType,
} from "@kotobad/shared/src/types/developerRoadmap";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	SubtleTab,
	SubtleTabItem,
	SubtleTabPanel,
} from "@/components/ui/subtle-tab";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { cn } from "@/lib/utils";

type Props = {
	items: DeveloperRoadmapListType;
	canEdit: boolean;
};

const ROADMAP_STATUS_ORDER: Record<DeveloperRoadmapStatusType, number> = {
	todo: 0,
	wip: 1,
	done: 2,
};

const ROADMAP_STATUS_BUTTON_ORDER: DeveloperRoadmapStatusType[] = [
	"todo",
	"wip",
	"done",
];

const ROADMAP_BADGE_SURFACE_CLASS =
	"relative overflow-hidden before:pointer-events-none before:absolute before:inset-x-[1px] before:top-[1px] before:h-[48%] before:rounded-full before:bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.12)_62%,rgba(255,255,255,0)_100%)] before:content-[''] dark:before:inset-x-0 dark:before:top-0 dark:before:h-[62%] dark:before:bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.58)_34%,rgba(255,255,255,0.18)_62%,rgba(255,255,255,0)_100%)] after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.08),0_6px_14px_rgba(15,23,42,0.1)] after:content-[''] dark:after:shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.26),0_0_0_1px_rgba(255,255,255,0.44),0_0_0_2px_rgba(255,255,255,0.18),0_0_20px_rgba(255,255,255,0.28),0_8px_18px_rgba(2,6,23,0.34)]";

const ROADMAP_CARD_CLASS: Record<DeveloperRoadmapStatusType, string> = {
	wip: "border border-slate-200/80 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
	todo: "border border-slate-200/80 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
	done: "border border-slate-200/80 bg-[rgba(255,255,255,0.78)] text-slate-700 [background-image:repeating-linear-gradient(-45deg,rgba(241,245,249,0.9)_0,rgba(241,245,249,0.9)_7px,transparent_7px,transparent_14px)] dark:border-slate-700 dark:bg-[rgba(15,23,42,0.82)] dark:text-slate-200 dark:[background-image:repeating-linear-gradient(-45deg,rgba(51,65,85,0.52)_0,rgba(51,65,85,0.52)_7px,transparent_7px,transparent_14px)]",
};

const ROADMAP_STATUS_META: Record<
	DeveloperRoadmapStatusType,
	{
		title: string;
		label: string;
		badgeClass: string;
		idleClass: string;
		floatingClass: string;
	}
> = {
	wip: {
		title: "作業中",
		label: "WIP",
		badgeClass:
			"border-violet-500 bg-violet-500 text-white dark:border-violet-400 dark:bg-violet-400 dark:text-slate-950",
		idleClass:
			"border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200",
		floatingClass: "-top-4 right-2 rotate-[5deg] sm:right-3",
	},
	todo: {
		title: "次やること",
		label: "TODO",
		badgeClass:
			"border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950",
		idleClass:
			"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200",
		floatingClass: "-top-4 right-2 rotate-[-4deg] sm:right-3",
	},
	done: {
		title: "やったこと",
		label: "DONE",
		badgeClass:
			"border-amber-500 bg-amber-500 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-slate-950",
		idleClass:
			"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200",
		floatingClass: "-bottom-4 right-2 rotate-[4deg] sm:-bottom-5 sm:right-3",
	},
};

const ROADMAP_COLLAPSED_CONTAINER_CLASS =
	"max-h-[188px] overflow-hidden pt-5 sm:max-h-[224px] sm:pt-6";

const sortRoadmapItems = (items: DeveloperRoadmapListType) =>
	items.slice().sort((left, right) => {
		const statusDiff =
			ROADMAP_STATUS_ORDER[left.status] - ROADMAP_STATUS_ORDER[right.status];
		if (statusDiff !== 0) {
			return statusDiff;
		}

		const sortOrderDiff = left.sortOrder - right.sortOrder;
		if (sortOrderDiff !== 0) {
			return sortOrderDiff;
		}

		return left.id - right.id;
	});

const getErrorMessage = (error: unknown) => {
	if (!(error instanceof Error)) {
		return "不明なエラーが発生しました";
	}

	const fetchError = error as BffFetcherError;
	if (fetchError.body) {
		try {
			const parsed = JSON.parse(fetchError.body) as unknown;
			if (typeof parsed === "object" && parsed !== null) {
				const record = parsed as Record<string, unknown>;
				if (typeof record.message === "string" && record.message.length > 0) {
					return record.message;
				}
				if (typeof record.error === "string" && record.error.length > 0) {
					return record.error;
				}
			}
		} catch {
			return error.message;
		}
	}

	return error.message;
};

export function DeveloperRoadmapList({ items: initialItems, canEdit }: Props) {
	const router = useRouter();
	const [items, setItems] = useState(() => sortRoadmapItems(initialItems));
	const [pendingItemId, setPendingItemId] = useState<number | null>(null);
	const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
	const [editingItemId, setEditingItemId] = useState<number | null>(null);
	const [editingTitle, setEditingTitle] = useState("");
	const [showArchived, setShowArchived] = useState(false);
	const [expandedStatusViews, setExpandedStatusViews] = useState<
		Record<DeveloperRoadmapStatusType, boolean>
	>({
		todo: false,
		wip: false,
		done: false,
	});
	const [selectedStatus, setSelectedStatus] =
		useState<DeveloperRoadmapStatusType>("todo");
	const [hasOverflowByStatus, setHasOverflowByStatus] = useState<
		Record<DeveloperRoadmapStatusType, boolean>
	>({
		todo: false,
		wip: false,
		done: false,
	});
	const collapsedContainerRefs = useRef<
		Record<DeveloperRoadmapStatusType, HTMLDivElement | null>
	>({
		todo: null,
		wip: null,
		done: null,
	});

	useEffect(() => {
		setItems(sortRoadmapItems(initialItems));
	}, [initialItems]);

	const activeItems = items.filter((item) => !item.isArchived);
	const archivedItems = items.filter((item) => item.isArchived);

	const handleRoadmapItemUpdate = async (
		item: DeveloperRoadmapItemType,
		values: UpdateDeveloperRoadmapItemType,
	) => {
		if (!canEdit || pendingItemId !== null) {
			return;
		}

		setPendingItemId(item.id);

		try {
			const updatedItem = await BffFetcher<DeveloperRoadmapItemType>(
				`/developer-notes/api/updateRoadmapItem/${item.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(values),
				},
			);

			setItems((previousItems) =>
				sortRoadmapItems(
					previousItems.map((previousItem) =>
						previousItem.id === updatedItem.id ? updatedItem : previousItem,
					),
				),
			);
			setExpandedItemId(null);
			setEditingItemId(null);
			setEditingTitle("");
			router.refresh();
		} catch (error: unknown) {
			toast.error(getErrorMessage(error));
		} finally {
			setPendingItemId(null);
		}
	};

	useEffect(() => {
		const status = selectedStatus;
		if (expandedStatusViews[status]) {
			return;
		}

		const container = collapsedContainerRefs.current[status];
		if (!container) {
			setHasOverflowByStatus((previousState) =>
				previousState[status]
					? {
							...previousState,
							[status]: false,
						}
					: previousState,
			);
			return;
		}

		const updateOverflowState = () => {
			const nextHasOverflow =
				container.scrollHeight > container.clientHeight + 1;
			setHasOverflowByStatus((previousState) =>
				previousState[status] === nextHasOverflow
					? previousState
					: {
							...previousState,
							[status]: nextHasOverflow,
						},
			);
		};

		const frameId = window.requestAnimationFrame(updateOverflowState);
		const handleResize = () => {
			window.requestAnimationFrame(updateOverflowState);
		};

		window.addEventListener("resize", handleResize);

		let resizeObserver: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(updateOverflowState);
			resizeObserver.observe(container);
		}

		return () => {
			window.cancelAnimationFrame(frameId);
			window.removeEventListener("resize", handleResize);
			resizeObserver?.disconnect();
		};
	}, [selectedStatus, expandedStatusViews]);

	const handleStatusChange = async (
		item: DeveloperRoadmapItemType,
		nextStatus: DeveloperRoadmapStatusType,
	) => {
		if (!canEdit || item.status === nextStatus || pendingItemId !== null) {
			return;
		}

		await handleRoadmapItemUpdate(item, { status: nextStatus });
	};

	const handleSaveTitle = async (item: DeveloperRoadmapItemType) => {
		const nextTitle = editingTitle.trim();
		if (!nextTitle) {
			toast.error("タイトルは1文字以上で入力してください");
			return;
		}

		if (nextTitle === item.title) {
			setEditingItemId(null);
			setEditingTitle("");
			return;
		}

		await handleRoadmapItemUpdate(item, { title: nextTitle });
	};

	const handleArchiveToggle = async (
		item: DeveloperRoadmapItemType,
		nextArchived: boolean,
	) => {
		await handleRoadmapItemUpdate(item, { isArchived: nextArchived });
	};

	const selectedStatusIndex =
		ROADMAP_STATUS_BUTTON_ORDER.indexOf(selectedStatus);

	const renderRoadmapCard = (item: DeveloperRoadmapItemType) => {
		const itemStatusMeta = ROADMAP_STATUS_META[item.status];
		const isPending = pendingItemId === item.id;
		const isExpanded = expandedItemId === item.id;
		const isEditing = editingItemId === item.id;

		return (
			<div
				key={item.id}
				className={cn(
					"w-fit max-w-full self-start min-w-[72px] sm:min-w-[80px]",
					item.status === "done" ? "pb-3 sm:pb-4" : "pt-3 sm:pt-4",
				)}
			>
				<article
					className={cn(
						"relative rounded-[13px] px-3 pb-2 pt-4 shadow-none transition-opacity sm:rounded-[14px] sm:px-4 sm:pb-2.5 sm:pt-5",
						ROADMAP_CARD_CLASS[item.status],
						isPending ? "opacity-60" : "",
					)}
				>
					{canEdit ? (
						<button
							type="button"
							onClick={() =>
								setExpandedItemId((previousItemId) =>
									previousItemId === item.id ? null : item.id,
								)
							}
							disabled={isPending}
							className={cn(
								"absolute shrink-0 cursor-pointer transition-transform disabled:cursor-default",
								itemStatusMeta.floatingClass,
							)}
						>
							<span
								className={cn(
									"inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black tracking-[0.1em] shadow-[0_8px_18px_rgba(15,23,42,0.12)] sm:px-3 sm:py-1.5 sm:text-[11px]",
									ROADMAP_BADGE_SURFACE_CLASS,
									itemStatusMeta.badgeClass,
									isExpanded ? "scale-[1.02]" : "",
								)}
							>
								{itemStatusMeta.label}
							</span>
						</button>
					) : (
						<span
							className={cn(
								"absolute inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black tracking-[0.1em] shadow-[0_8px_18px_rgba(15,23,42,0.12)] sm:px-3 sm:py-1.5 sm:text-[11px]",
								ROADMAP_BADGE_SURFACE_CLASS,
								itemStatusMeta.badgeClass,
								itemStatusMeta.floatingClass,
							)}
						>
							{itemStatusMeta.label}
						</span>
					)}

					{canEdit && isEditing ? (
						<div className="mt-1">
							<input
								value={editingTitle}
								onChange={(event) => setEditingTitle(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										handleSaveTitle(item);
									}
									if (event.key === "Escape") {
										event.preventDefault();
										setEditingItemId(null);
										setEditingTitle("");
									}
								}}
								disabled={isPending}
								className="w-full rounded-[10px] border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] font-medium leading-[1.5] tracking-tight text-slate-800 outline-none focus:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 sm:text-[14px]"
							/>
						</div>
					) : (
						<h4 className="text-[13px] leading-[1.5] font-medium tracking-tight text-inherit sm:text-[14px]">
							{item.title}
						</h4>
					)}

					{canEdit && isExpanded ? (
						<div className="mt-4 space-y-3">
							{!item.isArchived ? (
								<div className="flex flex-wrap gap-2">
									{ROADMAP_STATUS_BUTTON_ORDER.map((nextStatus) => {
										const nextStatusMeta = ROADMAP_STATUS_META[nextStatus];
										const isSelected = item.status === nextStatus;

										return (
											<button
												key={nextStatus}
												type="button"
												onClick={() => handleStatusChange(item, nextStatus)}
												disabled={isPending || isSelected}
												className="cursor-pointer rounded-full transition-opacity disabled:cursor-default"
											>
												<span
													className={cn(
														"inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black tracking-[0.1em] sm:px-3 sm:py-1.5 sm:text-[11px]",
														ROADMAP_BADGE_SURFACE_CLASS,
														isSelected
															? nextStatusMeta.badgeClass
															: nextStatusMeta.idleClass,
														isSelected
															? "shadow-[0_6px_16px_rgba(148,163,184,0.16)] dark:shadow-[0_6px_16px_rgba(2,6,23,0.38)]"
															: "hover:opacity-90",
													)}
												>
													{nextStatusMeta.label}
												</span>
											</button>
										);
									})}
								</div>
							) : null}

							<div className="flex flex-wrap gap-2">
								{isEditing ? (
									<>
										<button
											type="button"
											onClick={() => {
												setEditingItemId(null);
												setEditingTitle("");
											}}
											disabled={isPending}
											className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-default disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
										>
											キャンセル
										</button>
										<Button
											type="button"
											onClick={() => handleSaveTitle(item)}
											disabled={isPending}
											variant="logo1"
											hover="brightness"
											rounded="full"
											enableClickAnimation
											className="h-auto px-3 py-1.5 text-[12px] font-bold"
										>
											保存
										</Button>
									</>
								) : (
									<button
										type="button"
										onClick={() => {
											setEditingItemId(item.id);
											setEditingTitle(item.title);
										}}
										disabled={isPending}
										className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-default disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
									>
										編集
									</button>
								)}

								{!isEditing ? (
									<button
										type="button"
										onClick={() => handleArchiveToggle(item, !item.isArchived)}
										disabled={isPending}
										className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-default disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
									>
										{item.isArchived ? "復元" : "アーカイブ"}
									</button>
								) : null}
							</div>
						</div>
					) : null}
				</article>
			</div>
		);
	};

	const renderRoadmapGrid = (statusItems: DeveloperRoadmapListType) => (
		<div className="flex flex-wrap items-start gap-x-4 gap-y-4 sm:gap-x-5 sm:gap-y-5">
			{statusItems.map((item) => renderRoadmapCard(item))}
		</div>
	);

	return (
		<div className="mt-6 space-y-8 sm:mt-8 sm:space-y-12">
			<SubtleTab
				idPrefix="developer-roadmap-status-view"
				selectedIndex={Math.max(selectedStatusIndex, 0)}
				onSelect={(index) => {
					setSelectedStatus(ROADMAP_STATUS_BUTTON_ORDER[index] ?? "todo");
					setExpandedItemId(null);
				}}
				className="w-full rounded-full border border-slate-200 bg-white/80 px-1.5 py-1 dark:border-slate-700 dark:bg-slate-900/70 sm:w-fit sm:px-2 sm:py-1.5"
			>
				{ROADMAP_STATUS_BUTTON_ORDER.map((status, index) => (
					<SubtleTabItem
						key={status}
						index={index}
						label={ROADMAP_STATUS_META[status].title}
						className="min-w-0 flex-1 justify-center px-3.5 py-2.5 text-center font-semibold sm:px-5 sm:py-3.5"
					/>
				))}
			</SubtleTab>

			{ROADMAP_STATUS_BUTTON_ORDER.map((status, index) => {
				const statusItems = activeItems.filter(
					(item) => item.status === status,
				);
				const isStatusExpanded = expandedStatusViews[status];
				const hasOverflow = hasOverflowByStatus[status];

				return (
					<SubtleTabPanel
						key={status}
						index={index}
						selectedIndex={Math.max(selectedStatusIndex, 0)}
						idPrefix="developer-roadmap-status-view"
						className="pt-5 sm:pt-7"
					>
						{statusItems.length > 0 ? (
							<div className="space-y-4 sm:space-y-5">
								<div className="relative">
									<div
										ref={(node) => {
											collapsedContainerRefs.current[status] = node;
										}}
										className={cn(
											!isStatusExpanded && ROADMAP_COLLAPSED_CONTAINER_CLASS,
										)}
									>
										{renderRoadmapGrid(statusItems)}
									</div>

									{!isStatusExpanded && hasOverflow ? (
										<div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-b from-[#ebf6ff]/0 via-[#ebf6ff]/52 to-[#ebf6ff]/90 px-4 pb-3 dark:from-slate-900/0 dark:via-slate-900/55 dark:to-slate-900/92 sm:h-28 sm:pb-4">
											<button
												type="button"
												onClick={() =>
													setExpandedStatusViews((previousState) => ({
														...previousState,
														[status]: true,
													}))
												}
												className="pointer-events-auto inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[12px] font-bold tracking-[0.08em] text-slate-700 shadow-[0_12px_24px_rgba(148,163,184,0.14)] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
											>
												全て表示
											</button>
										</div>
									) : null}
								</div>

								{isStatusExpanded ? (
									<div className="flex justify-center pt-1">
										<button
											type="button"
											onClick={() =>
												setExpandedStatusViews((previousState) => ({
													...previousState,
													[status]: false,
												}))
											}
											className="inline-flex cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
										>
											閉じる
										</button>
									</div>
								) : null}
							</div>
						) : (
							<p className="pt-4 text-sm text-slate-500 dark:text-slate-400 sm:pt-5">
								項目はありません。
							</p>
						)}
					</SubtleTabPanel>
				);
			})}

			{canEdit ? (
				<section className="space-y-3 border-t border-slate-200/80 pt-6 dark:border-slate-700/80">
					<div className="flex items-center justify-between gap-3">
						<p className="text-[13px] font-bold tracking-[0.08em] text-slate-500 dark:text-slate-300">
							アーカイブ ({archivedItems.length})
						</p>
						<button
							type="button"
							onClick={() => {
								setShowArchived((value) => !value);
								setExpandedItemId(null);
								setEditingItemId(null);
								setEditingTitle("");
							}}
							className="inline-flex cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
						>
							{showArchived ? "非表示" : "表示"}
						</button>
					</div>

					{showArchived ? (
						archivedItems.length > 0 ? (
							renderRoadmapGrid(archivedItems)
						) : (
							<p className="pt-1 text-sm text-slate-500 dark:text-slate-400">
								アーカイブ項目はありません。
							</p>
						)
					) : null}
				</section>
			) : null}
		</div>
	);
}
