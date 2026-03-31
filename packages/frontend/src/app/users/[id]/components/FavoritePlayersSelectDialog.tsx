"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import Image from "next/image";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type Props = {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	players: UserProfileSelectablePlayerType[];
	selectedPlayers: FavoritePlayerType[];
	isLoading: boolean;
	loadError: string | null;
	onReloadAction: () => Promise<void>;
	onTogglePlayerAction: (player: UserProfileSelectablePlayerType) => void;
	onRemovePlayerAction: (playerId: number) => void;
};

const sortOptions = [
	{ value: "name_asc", label: "名前順（あ→ん）" },
	{ value: "name_desc", label: "名前順（ん→あ）" },
	{ value: "newest", label: "追加順（新しいID）" },
	{ value: "oldest", label: "追加順（古いID）" },
] as const;

const normalize = (value: string) => value.trim().toLowerCase();

export function FavoritePlayersSelectDialog({
	open,
	onOpenChangeAction,
	players,
	selectedPlayers,
	isLoading,
	loadError,
	onReloadAction,
	onTogglePlayerAction,
	onRemovePlayerAction,
}: Props) {
	const [query, setQuery] = useState("");
	const [sort, setSort] =
		useState<(typeof sortOptions)[number]["value"]>("name_asc");
	const selectedIdSet = new Set(selectedPlayers.map((player) => player.id));
	const normalizedQuery = normalize(query);

	const list =
		normalizedQuery.length === 0
			? players
			: players.filter((player) =>
					[
						player.lastName,
						player.firstName,
						player.lastFurigana,
						player.firstFurigana,
						player.englishLastName,
						player.englishFirstName,
					]
						.join(" ")
						.toLowerCase()
						.includes(normalizedQuery),
				);
	const filteredPlayers = [...list];
	filteredPlayers.sort((left, right) => {
		if (sort === "newest") return right.id - left.id;
		if (sort === "oldest") return left.id - right.id;

		const leftName = `${left.lastFurigana} ${left.firstFurigana}`.trim();
		const rightName = `${right.lastFurigana} ${right.firstFurigana}`.trim();
		const compared = leftName.localeCompare(rightName, "ja");
		if (sort === "name_desc") {
			return compared * -1;
		}
		return compared;
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChangeAction}>
			<DialogContent className="w-[calc(100vw-1rem)] max-w-4xl rounded-md p-0">
				<div className="flex h-[min(88vh,760px)] flex-col">
					<DialogHeader className="border-b px-4 py-3">
						<DialogTitle className="text-base">好きな選手を選択</DialogTitle>
						<DialogDescription className="text-xs text-slate-500">
							最大3人まで選択できます
						</DialogDescription>
						<div className="grid gap-2 sm:grid-cols-[1fr_14rem]">
							<input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								type="search"
								placeholder="選手名で検索"
								className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-400"
							/>
							<select
								value={sort}
								onChange={(event) => setSort(event.target.value as typeof sort)}
								className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-400"
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</DialogHeader>

					<div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
						{isLoading ? (
							<p className="py-10 text-center text-sm text-slate-500">
								選手一覧を読み込み中...
							</p>
						) : loadError ? (
							<div className="py-10 text-center">
								<p className="text-sm text-rose-600">{loadError}</p>
								<button
									type="button"
									className="mt-2 text-sm text-blue-600"
									onClick={() => void onReloadAction()}
								>
									再読み込み
								</button>
							</div>
						) : filteredPlayers.length === 0 ? (
							<p className="py-10 text-center text-sm text-slate-500">
								該当する選手が見つかりません
							</p>
						) : (
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
								{filteredPlayers.map((player) => {
									const isSelected = selectedIdSet.has(player.id);
									const cannotSelectMore =
										!isSelected && selectedPlayers.length >= 3;
									return (
										<button
											type="button"
											key={player.id}
											onClick={() => onTogglePlayerAction(player)}
											disabled={cannotSelectMore}
											className={[
												"flex flex-col items-center gap-2 rounded-md border p-2 text-center transition-colors",
												isSelected
													? "border-blue-500 bg-blue-50 text-blue-900"
													: "border-slate-200 bg-white text-slate-700",
												cannotSelectMore ? "opacity-50" : "",
											].join(" ")}
										>
											{player.imageUrl ? (
												<Image
													src={player.imageUrl}
													alt={`${player.lastName} ${player.firstName}`}
													width={64}
													height={64}
													unoptimized
													className="h-16 w-16 rounded-md object-cover"
												/>
											) : (
												<div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500">
													No Image
												</div>
											)}
											<div className="min-h-10">
												<p className="text-sm font-medium leading-4">
													{player.lastName} {player.firstName}
												</p>
												<p className="mt-1 text-[11px] text-slate-500">
													{player.lastFurigana} {player.firstFurigana}
												</p>
											</div>
										</button>
									);
								})}
							</div>
						)}
					</div>

					<div className="border-t bg-white px-4 py-3">
						<p className="text-xs text-slate-500">
							選択中 {selectedPlayers.length}/3
						</p>
						<div className="mt-2 flex gap-2 overflow-x-auto pb-1">
							{selectedPlayers.length === 0 ? (
								<p className="text-sm text-slate-400">未選択です</p>
							) : (
								selectedPlayers.map((player) => (
									<div
										key={player.id}
										className="relative min-w-24 rounded-md border border-blue-300 bg-blue-50 px-2 py-2 pr-6"
									>
										<button
											type="button"
											aria-label={`${player.name} を選択解除`}
											onClick={() => onRemovePlayerAction(player.id)}
											className="absolute top-1 right-1 text-xs leading-none text-blue-700"
										>
											×
										</button>
										<p className="text-xs font-medium text-blue-900">
											{player.name}
										</p>
									</div>
								))
							)}
						</div>
						<button type="button" className="mt-2 text-sm text-blue-600">
							追加リクエスト →
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
