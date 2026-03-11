"use client";

import type {
	DeveloperRoadmapItemType,
	DeveloperRoadmapListType,
	DeveloperRoadmapStatusType,
} from "@kotobad/shared/src/types/developerRoadmap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
	wip: 0,
	todo: 1,
	done: 2,
};

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
		title: "今やっていること",
		label: "WIP",
		badgeClass:
			"border-violet-500 bg-violet-500 text-white dark:border-violet-400 dark:bg-violet-400 dark:text-slate-950",
		idleClass:
			"border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200",
		floatingClass: "-top-4 right-4 rotate-[5deg]",
	},
	todo: {
		title: "次やること",
		label: "TODO",
		badgeClass:
			"border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950",
		idleClass:
			"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200",
		floatingClass: "-top-4 right-4 rotate-[-4deg]",
	},
	done: {
		title: "やったこと",
		label: "DONE",
		badgeClass:
			"border-amber-500 bg-amber-500 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-slate-950",
		idleClass:
			"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200",
		floatingClass: "-top-4 right-4 rotate-[4deg]",
	},
};

const ROADMAP_STATUS_BUTTON_ORDER: DeveloperRoadmapStatusType[] = [
	"wip",
	"todo",
	"done",
];

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
			const parsed = JSON.parse(fetchError.body) as { error?: string };
			if (parsed.error) {
				return parsed.error;
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

	useEffect(() => {
		setItems(sortRoadmapItems(initialItems));
	}, [initialItems]);

	const handleStatusChange = async (
		item: DeveloperRoadmapItemType,
		nextStatus: DeveloperRoadmapStatusType,
	) => {
		if (!canEdit || item.status === nextStatus || pendingItemId !== null) {
			return;
		}

		setPendingItemId(item.id);

		try {
			const updatedItem = await BffFetcher<DeveloperRoadmapItemType>(
				`/developer-notes/api/updateRoadmapStatus/${item.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ status: nextStatus }),
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
			router.refresh();
		} catch (error: unknown) {
			toast.error(getErrorMessage(error));
		} finally {
			setPendingItemId(null);
		}
	};

	const groupedItems = ROADMAP_STATUS_BUTTON_ORDER.map((status) => ({
		status,
		items: items.filter((item) => item.status === status),
	}));

	return (
		<div className="mt-8 space-y-8">
			{groupedItems.map(({ status, items: statusItems }) => {
				const statusMeta = ROADMAP_STATUS_META[status];

				return (
					<section key={status} className="space-y-4">
						<div className="flex items-end justify-between gap-3">
							<h3 className="text-[18px] font-bold tracking-tight text-slate-950 dark:text-slate-50">
								{statusMeta.title}
							</h3>
						</div>

						{statusItems.length > 0 ? (
							<div className="flex flex-wrap items-start gap-3 sm:gap-4">
								{statusItems.map((item) => {
									const itemStatusMeta = ROADMAP_STATUS_META[item.status];
									const isPending = pendingItemId === item.id;
									const isExpanded = expandedItemId === item.id;

									return (
										<article
											key={item.id}
											className={cn(
												"relative min-w-[220px] rounded-[16px] px-5 pb-4 pt-7 shadow-none transition-opacity sm:max-w-[320px]",
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
														"absolute shrink-0 transition-transform",
														itemStatusMeta.floatingClass,
													)}
												>
													<span
														className={cn(
															"inline-flex rounded-full border px-4 py-2 text-[12px] font-black tracking-[0.1em] shadow-[0_8px_18px_rgba(15,23,42,0.12)]",
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
														"absolute inline-flex shrink-0 rounded-full border px-4 py-2 text-[12px] font-black tracking-[0.1em] shadow-[0_8px_18px_rgba(15,23,42,0.12)]",
														itemStatusMeta.badgeClass,
														itemStatusMeta.floatingClass,
													)}
												>
													{itemStatusMeta.label}
												</span>
											)}

											<h4 className="text-[15px] leading-[1.55] font-medium tracking-tight text-inherit">
												{item.title}
											</h4>

											{canEdit && isExpanded ? (
												<div className="mt-4 flex flex-wrap gap-2">
													{ROADMAP_STATUS_BUTTON_ORDER.map((nextStatus) => {
														const nextStatusMeta =
															ROADMAP_STATUS_META[nextStatus];
														const isSelected = item.status === nextStatus;

														return (
															<button
																key={nextStatus}
																type="button"
																onClick={() =>
																	handleStatusChange(item, nextStatus)
																}
																disabled={isPending || isSelected}
																className="rounded-full transition-opacity disabled:cursor-default"
															>
																<span
																	className={cn(
																		"inline-flex rounded-full border px-4 py-2 text-[12px] font-black tracking-[0.1em]",
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
										</article>
									);
								})}
							</div>
						) : (
							<p className="text-sm text-slate-500 dark:text-slate-400">
								項目はありません。
							</p>
						)}
					</section>
				);
			})}
		</div>
	);
}
