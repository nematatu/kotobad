"use client";

import type {
	DeveloperRoadmapItemType,
	DeveloperRoadmapListType,
	DeveloperRoadmapStatusType,
} from "@kotobad/shared/src/types/developerRoadmap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
	wip: "bg-[#ffffff] text-[#6f767a]",
	todo: "bg-[#ffffff] text-[#6f767a]",
	done: "bg-[rgba(255,255,255,0.68)] text-[#6f767a] [background-image:repeating-linear-gradient(-45deg,rgba(255,255,255,0.75)_0,rgba(255,255,255,0.75)_6px,transparent_6px,transparent_12px)]",
};

const ROADMAP_FLOATING_BADGE_META: Record<
	DeveloperRoadmapStatusType,
	{
		label: string;
		color: "violet" | "emerald" | "amber";
		className: string;
	}
> = {
	wip: {
		label: "WIP",
		color: "violet",
		className: "-top-4 right-3 rotate-[4deg]",
	},
	todo: {
		label: "todo",
		color: "emerald",
		className: "-bottom-4 right-3",
	},
	done: {
		label: "done",
		color: "amber",
		className: "-bottom-4 right-3",
	},
};

const ROADMAP_STATUS_BUTTON_META: Record<
	DeveloperRoadmapStatusType,
	{
		label: string;
		color: "violet" | "emerald" | "amber";
	}
> = {
	wip: {
		label: "WIP",
		color: "violet",
	},
	todo: {
		label: "Todo",
		color: "emerald",
	},
	done: {
		label: "Done",
		color: "amber",
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
	const [items, setItems] = useState(initialItems);
	const [pendingItemId, setPendingItemId] = useState<number | null>(null);

	useEffect(() => {
		setItems(initialItems);
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
			router.refresh();
		} catch (error: unknown) {
			toast.error(getErrorMessage(error));
		} finally {
			setPendingItemId(null);
		}
	};

	return (
		<div className="mt-6 flex flex-wrap items-start gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-7">
			{items.map((item) => {
				const badgeMeta = ROADMAP_FLOATING_BADGE_META[item.status];
				const isPending = pendingItemId === item.id;

				return (
					<article
						key={item.id}
						className={cn(
							"relative rounded-[12px] px-5 py-3 shadow-none transition-opacity",
							ROADMAP_CARD_CLASS[item.status],
							isPending ? "opacity-60" : "",
						)}
					>
						<h3 className="text-[15px] leading-[1.45] font-normal tracking-tight text-inherit">
							{item.title}
						</h3>
						<Badge
							variant="dot"
							color={badgeMeta.color}
							className={cn(
								"absolute px-[10px] py-[4px] text-[11px] font-bold tracking-[0.04em]",
								badgeMeta.className,
							)}
						>
							{badgeMeta.label}
						</Badge>

						{canEdit ? (
							<div className="mt-4 flex flex-wrap gap-2">
								{ROADMAP_STATUS_BUTTON_ORDER.map((status) => {
									const statusMeta = ROADMAP_STATUS_BUTTON_META[status];
									const isSelected = item.status === status;

									return (
										<button
											key={status}
											type="button"
											onClick={() => handleStatusChange(item, status)}
											disabled={isPending || isSelected}
											className={cn(
												"rounded-full transition-opacity disabled:cursor-default",
												isSelected ? "" : "opacity-70 hover:opacity-100",
											)}
										>
											<Badge
												variant="dot"
												color={statusMeta.color}
												className={cn(
													"px-[10px] py-[4px] text-[11px] font-bold tracking-[0.04em]",
													isSelected
														? "shadow-[0_6px_16px_rgba(148,163,184,0.16)]"
														: "bg-white/72 dark:bg-slate-900/65",
												)}
											>
												{statusMeta.label}
											</Badge>
										</button>
									);
								})}
							</div>
						) : null}
					</article>
				);
			})}
		</div>
	);
}
