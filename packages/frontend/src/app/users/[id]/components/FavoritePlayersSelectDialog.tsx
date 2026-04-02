"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import { ArrowUpRight, Check, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ActionLink from "@/components/common/button/ActionLink";
import IconButton from "@/components/common/button/IconButton";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toPresetCfImageUrl } from "@/lib/utils/cfImage";
import { FavoritePlayerImageCard } from "./FavoritePlayerImageCard";

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
const toPlayerCardImageUrl = (sourceUrl: string) =>
	toPresetCfImageUrl(sourceUrl, "playerCard") ?? sourceUrl;
const toPlayerPreviewImageUrl = (sourceUrl: string) =>
	toPresetCfImageUrl(sourceUrl, "zoom") ?? sourceUrl;

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
	const [previewImage, setPreviewImage] = useState<{
		src: string;
		alt: string;
	} | null>(null);

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
		<>
			<Dialog open={open} onOpenChange={onOpenChangeAction}>
				<DialogContent
					className="w-[calc(100vw-0.375rem)] max-w-4xl rounded-md p-0"
					closeButtonClassName="hidden sm:inline-flex right-3 top-3 z-40 h-8 w-8 bg-white/95 text-slate-700 opacity-100 shadow-sm"
				>
					<div className="flex h-[min(94vh,820px)] flex-col">
						<DialogHeader className="border-b px-4 py-3">
							<DialogTitle className="text-base">
								好きな選手を登録しよう
							</DialogTitle>
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

						<div
							className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
							data-pull-refresh-block="true"
						>
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
										const imageUrl = player.imageUrl;
										const cardImageUrl = imageUrl
											? toPlayerCardImageUrl(imageUrl)
											: null;
										const isSelected = selectedIdSet.has(player.id);
										const cannotSelectMore =
											!isSelected &&
											draftSelectedPlayers.length >= MAX_FAVORITE_PLAYERS;
										return (
											<div
												key={player.id}
												className={cn(
													"relative aspect-[1/1] overflow-hidden rounded-md border bg-slate-100 text-left transition-all hover:scale-110 hover:z-1",
													isSelected
														? "border-blue-500 ring-2 ring-blue-500/40"
														: "border-slate-200",
													cannotSelectMore && "opacity-50",
												)}
											>
												<button
													type="button"
													aria-label={`${player.lastName} ${player.firstName} を選択`}
													onClick={() => togglePlayerAction(player)}
													disabled={cannotSelectMore}
													className="absolute inset-0 z-10 cursor-pointer"
												/>
												{cardImageUrl ? (
													<Image
														src={cardImageUrl}
														alt={`${player.lastName} ${player.firstName}`}
														width={240}
														height={240}
														unoptimized
														className="absolute inset-0 h-full w-full object-cover"
													/>
												) : (
													<div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-[10px] text-slate-500 sm:text-xs">
														No Image
													</div>
												)}
												<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/85 via-black/60 to-transparent" />
												{imageUrl ? (
													<Button
														variant="ghost"
														size="icon"
														aria-label="画像を拡大表示"
														onClick={() =>
															setPreviewImage({
																src: toPlayerPreviewImageUrl(imageUrl),
																alt: `${player.lastName} ${player.firstName}`,
															})
														}
														className="absolute right-1.5 bottom-1.5 z-30 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/55 text-white hover:none"
													>
														<ZoomIn className="h-3.5 w-3.5 hover:scale-110" />
													</Button>
												) : null}
												<div className="pointer-events-none absolute right-1.5 top-1.5 z-20">
													{isSelected ? (
														<div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white bg-blue-600 text-white">
															<Check strokeWidth="4" className="h-5 w-5" />
														</div>
													) : null}
												</div>
												<div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-2 pb-1.5">
													<p className="truncate text-xs font-bold leading-tight text-white sm:text-sm">
														{player.lastName} {player.firstName}
													</p>
													<p className="truncate text-[10px] leading-tight text-slate-200 sm:text-[11px]">
														{player.lastFurigana} {player.firstFurigana}
													</p>
												</div>
											</div>
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
										<FavoritePlayerImageCard
											key={player.id}
											player={player}
											onRemoveAction={removePlayerAction}
										/>
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
					<div className="absolute right-3 bottom-3 z-30 sm:hidden">
						<Button
							type="button"
							size="sm"
							className="h-9 rounded-full bg-slate-900/90 px-4 text-xs text-white [@media(hover:hover)]:hover:bg-slate-900"
							onClick={() => onOpenChangeAction(false)}
						>
							閉じる
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				open={previewImage !== null}
				onOpenChange={(openState) => {
					if (!openState) {
						setPreviewImage(null);
					}
				}}
			>
				<DialogContent
					className="w-[calc(100vw-0.375rem)] max-w-2xl rounded-md border-slate-900 bg-black p-0"
					closeButtonClassName="hidden sm:inline-flex right-3 top-3 z-40 h-8 w-8 bg-black/70 text-white opacity-100 shadow-sm"
				>
					<DialogHeader className="sr-only">
						<DialogTitle>選手画像プレビュー</DialogTitle>
					</DialogHeader>
					<div className="relative flex h-[min(90vh,980px)] items-center justify-center">
						{previewImage ? (
							<Image
								src={previewImage.src}
								alt={previewImage.alt}
								fill
								unoptimized
								className="object-contain"
							/>
						) : null}
					</div>
					<div className="absolute right-3 bottom-3 z-30 sm:hidden">
						<Button
							type="button"
							size="sm"
							className="h-9 rounded-full bg-white/95 px-4 text-xs text-slate-900 [@media(hover:hover)]:hover:bg-white"
							onClick={() => setPreviewImage(null)}
						>
							閉じる
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
