"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import { ArrowUpRight, Check, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ActionLink from "@/components/common/button/ActionLink";
import IconButton from "@/components/common/button/IconButton";
import { Button } from "@/components/ui/button";
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
	onApplySelectedPlayersAction: (players: FavoritePlayerType[]) => void;
};

const normalize = (value: string) => value.trim().toLowerCase();
const MAX_FAVORITE_PLAYERS = 3;

export function FavoritePlayersSelectDialog({
	open,
	onOpenChangeAction,
	players,
	selectedPlayers,
	isLoading,
	loadError,
	onReloadAction,
	onApplySelectedPlayersAction,
}: Props) {
	const [query, setQuery] = useState("");
	const [draftSelectedPlayers, setDraftSelectedPlayers] =
		useState<FavoritePlayerType[]>(selectedPlayers);

	useEffect(() => {
		if (!open) return;
		setDraftSelectedPlayers(selectedPlayers);
	}, [open, selectedPlayers]);

	const selectedIdSet = new Set(
		draftSelectedPlayers.map((player) => player.id),
	);
	const normalizedQuery = normalize(query);

	const togglePlayerAction = (player: UserProfileSelectablePlayerType) => {
		const exists = draftSelectedPlayers.some((item) => item.id === player.id);
		if (exists) {
			setDraftSelectedPlayers((current) =>
				current.filter((item) => item.id !== player.id),
			);
			return;
		}
		if (draftSelectedPlayers.length >= MAX_FAVORITE_PLAYERS) {
			return;
		}
		setDraftSelectedPlayers((current) => [
			...current,
			{
				id: player.id,
				name: `${player.lastName} ${player.firstName}`,
				imageUrl: player.imageUrl ?? null,
			},
		]);
	};

	const removePlayerAction = (playerId: number) => {
		setDraftSelectedPlayers((current) =>
			current.filter((item) => item.id !== playerId),
		);
	};

	const applySelectedPlayersAction = () => {
		onApplySelectedPlayersAction(draftSelectedPlayers);
		onOpenChangeAction(false);
	};

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
		const leftName = `${left.lastFurigana} ${left.firstFurigana}`.trim();
		const rightName = `${right.lastFurigana} ${right.firstFurigana}`.trim();
		const compared = leftName.localeCompare(rightName, "ja");
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
							<div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-5">
								{filteredPlayers.map((player) => {
									const isSelected = selectedIdSet.has(player.id);
									const cannotSelectMore =
										!isSelected &&
										draftSelectedPlayers.length >= MAX_FAVORITE_PLAYERS;
									return (
										<button
											type="button"
											key={player.id}
											onClick={() => togglePlayerAction(player)}
											disabled={cannotSelectMore}
											className={[
												"flex flex-col items-center gap-1 rounded-md border px-1.5 py-2 text-center transition-colors sm:gap-1.5 sm:px-2",
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
													width={56}
													height={56}
													unoptimized
													className="h-12 w-12 rounded-md object-cover sm:h-14 sm:w-14"
												/>
											) : (
												<div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-500 sm:h-14 sm:w-14 sm:text-xs">
													No Image
												</div>
											)}
											<div className="w-full">
												<p className="text-xs font-medium leading-tight sm:text-sm">
													{player.lastName} {player.firstName}
												</p>
												<p className="mt-0.5 hidden text-[10px] leading-tight text-slate-500 sm:block">
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
							選択中 {draftSelectedPlayers.length}/{MAX_FAVORITE_PLAYERS}
						</p>
						<div className="mt-2 flex gap-2 overflow-x-auto pt-2 pb-1">
							{draftSelectedPlayers.length === 0 ? (
								<p className="text-sm text-slate-400">未選択です</p>
							) : (
								draftSelectedPlayers.map((player) => (
									<div
										key={player.id}
										className="relative flex min-w-24 flex-col items-center justify-center bg-white space-y-2"
									>
										<Button
											variant="outline"
											size="icon"
											rounded="full"
											enableClickAnimation
											aria-label={`${player.name} を選択解除`}
											onClick={() => removePlayerAction(player.id)}
											className="absolute -top-2 right-2 z-10 h-6 w-6 border-2 border-slate-200 bg-red-500 p-3 shadow-none [@media(hover:hover)]:hover:bg-red-400"
										>
											<X strokeWidth="4" className="h-3.5 w-3.5 text-white" />
										</Button>
										{player.imageUrl ? (
											<Image
												src={player.imageUrl}
												alt={player.name}
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
										<p className="text-[15px] font-bold">{player.name}</p>
									</div>
								))
							)}
						</div>
						<div className="mt-2 flex items-center justify-between gap-2">
							<ActionLink
								item={{
									label: "追加リクエスト",
									href: "#",
									tone: "accent",
									icon: ArrowUpRight,
									iconPosition: "right",
								}}
								className="text-sm text-blue-600 underline underline-offset-4"
							/>
							<IconButton
								icon={<Check />}
								iconPosition="right"
								className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-bold text-slate-200 transition-colors [@media(hover:hover)]:hover:bg-blue-700"
								enableClickAnimation
								onClick={applySelectedPlayersAction}
							>
								追加する
							</IconButton>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
