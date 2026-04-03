"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { Camera, Check, Loader2, X } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import IconButton from "@/components/common/button/IconButton";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Button } from "@/components/ui/button";
import {
	MAX_PROFILE_BIO_LENGTH,
	MAX_PROFILE_NAME_LENGTH,
} from "../lib/profileEditor";
import { FavoritePlayerImageCard } from "./FavoritePlayerImageCard";
import { FavoritePlayersSelectDialog } from "./FavoritePlayersSelectDialog";

type EditorCardViewModel = {
	isLogin: boolean;
	isEditing: boolean;
	isSavingProfile: boolean;
	profileId: string;
	createdAt: string;
	threadCount: number;
	postCount: number;
	favoritePlayerCount: number;
	editedName: string;
	editedBio: string;
	avatarImage: string | null;
	editedFavoritePlayers: FavoritePlayerType[];
	isFavoritePlayersDialogOpen: boolean;
	favoritePlayerOptions: UserProfileSelectablePlayerType[];
	isLoadingFavoritePlayers: boolean;
	favoritePlayersLoadError: string | null;
	avatarInputRef: RefObject<HTMLInputElement | null>;
};

type EditorCardActions = {
	onStartEditingAction: () => void;
	onOpenConfirmAction: () => void;
	onCancelEditingAction: () => void;
	onOpenAvatarFileDialogAction: () => void;
	onAvatarFileChangeAction: (event: ChangeEvent<HTMLInputElement>) => void;
	onEditedNameChangeAction: (value: string) => void;
	onEditedBioChangeAction: (value: string) => void;
	onFavoritePlayersDialogOpenChangeAction: (open: boolean) => void;
	onSetFavoritePlayersAction: (players: FavoritePlayerType[]) => void;
	onReloadFavoritePlayersAction: () => Promise<void>;
};

type Props = {
	viewModel: EditorCardViewModel;
	actions: EditorCardActions;
};

export function UserProfileEditorCard({ viewModel, actions }: Props) {
	const {
		isLogin,
		isEditing,
		isSavingProfile,
		profileId,
		createdAt,
		threadCount,
		postCount,
		favoritePlayerCount,
		editedName,
		editedBio,
		avatarImage,
		editedFavoritePlayers,
		isFavoritePlayersDialogOpen,
		favoritePlayerOptions,
		isLoadingFavoritePlayers,
		favoritePlayersLoadError,
		avatarInputRef,
	} = viewModel;
	const {
		onStartEditingAction,
		onOpenConfirmAction,
		onCancelEditingAction,
		onOpenAvatarFileDialogAction,
		onAvatarFileChangeAction,
		onEditedNameChangeAction,
		onEditedBioChangeAction,
		onFavoritePlayersDialogOpenChangeAction,
		onSetFavoritePlayersAction,
		onReloadFavoritePlayersAction,
	} = actions;

	return (
		<section className="relative overflow-hidden bg-white">
			{isEditing ? (
				<div className="mx-auto w-full max-w-[1070px] pt-4 pb-0 [font-family:Roboto,Arial,sans-serif] sm:pt-6">
					<div className="h-[118px] w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#76b8ff_0%,#86a8ff_25%,#7edac4_100%)] sm:h-[172px]" />
					<div className="relative mt-4 px-1 sm:px-0">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
							<div className="group relative inline-flex">
								<AuthorAvatar
									name={editedName}
									image={avatarImage}
									className="h-24 w-24 bg-white sm:h-40 sm:w-40"
									fallbackClassName="text-xl sm:text-3xl"
								/>
								<button
									type="button"
									className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/25"
									onClick={onOpenAvatarFileDialogAction}
									disabled={isSavingProfile}
									aria-label="アイコン画像を変更"
								>
									{isSavingProfile ? (
										<Loader2 className="h-5 w-5 animate-spin" />
									) : (
										<Camera className="h-5 w-5" />
									)}
								</button>
								<input
									ref={avatarInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
									className="hidden"
									onChange={onAvatarFileChangeAction}
								/>
							</div>
							<div className="min-w-0 flex-1 pt-1 sm:pt-2">
								<div className="flex items-start gap-3">
									<div className="group relative min-w-0 flex-1 rounded-md border border-slate-300 bg-white transition-colors focus-within:!border-blue-600">
										<label
											htmlFor="name"
											className="pointer-events-none absolute top-1 left-3 text-[11px] font-medium text-slate-500 transition-colors group-focus-within:text-blue-600"
										>
											名前
										</label>
										<input
											id="name"
											type="text"
											value={editedName}
											onChange={(event) =>
												onEditedNameChangeAction(event.target.value)
											}
											maxLength={MAX_PROFILE_NAME_LENGTH}
											className="h-14 w-full rounded-md border-0 bg-transparent px-3 pt-6 pb-5 text-[20px] font-bold text-[#0f0f0f] outline-none focus:ring-0 sm:h-[58px] sm:text-[36px] sm:leading-[50px]"
										/>
										<span className="pointer-events-none absolute right-3 bottom-1 text-[11px] text-slate-400">
											{editedName.length}/{MAX_PROFILE_NAME_LENGTH}
										</span>
									</div>
									<div className="mt-0.5 flex items-center gap-2">
										<IconButton
											variant="outline"
											icon={<X />}
											rounded="full"
											enableClickAnimation
											className="h-9 rounded-full border border-slate-300 bg-white text-[#0f0f0f] [@media(hover:hover)]:hover:bg-slate-100"
											disabled={isSavingProfile}
											onClick={onCancelEditingAction}
										>
											<span className="font-medium">キャンセル</span>
										</IconButton>
										<IconButton
											variant="logo1"
											icon={<Check />}
											rounded="full"
											enableClickAnimation
											hover="brightness"
											className="h-9 rounded-full bg-[#0f0f0f] px-4 text-white [@media(hover:hover)]:hover:bg-[#272727]"
											disabled={isSavingProfile}
											onClick={onOpenConfirmAction}
										>
											<span className="font-medium">完了</span>
										</IconButton>
									</div>
								</div>
								<p className="mt-1 line-clamp-1 text-sm text-[#606060] sm:text-[14px] sm:leading-[20px]">
									@{profileId} ・ スレッド {threadCount} 件 ・ 返信 {postCount}{" "}
									件
								</p>
								<div className="group relative mt-2 w-full max-w-2xl rounded-md border border-slate-300 bg-white transition-colors focus-within:!border-blue-600">
									<label
										htmlFor="bio"
										className="pointer-events-none absolute top-1 left-3 text-[11px] font-medium text-slate-500 transition-colors group-focus-within:text-blue-600"
									>
										自己紹介
									</label>
									<textarea
										id="bio"
										value={editedBio}
										onChange={(event) =>
											onEditedBioChangeAction(event.target.value)
										}
										maxLength={MAX_PROFILE_BIO_LENGTH}
										rows={2}
										className="w-full resize-none overflow-y-auto rounded-md border-0 bg-transparent px-3 pt-7 pb-6 text-sm text-[#0f0f0f] outline-none focus:ring-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:text-[14px] sm:leading-[20px]"
									/>
									<span className="pointer-events-none absolute right-3 bottom-1 text-[11px] text-slate-400">
										{editedBio.length}/{MAX_PROFILE_BIO_LENGTH}
									</span>
								</div>
								<div className="mt-2 space-y-2">
									<div className="flex items-center gap-2">
										<p className="text-xs text-[#606060] sm:text-[14px] sm:leading-[20px]">
											好きな選手 {favoritePlayerCount} 人 ・ 登録日{" "}
											{formatDate(createdAt, { withTime: false })}
										</p>
										<button
											type="button"
											className="text-xs text-blue-600 sm:text-[13px]"
											onClick={() =>
												onFavoritePlayersDialogOpenChangeAction(true)
											}
										>
											選択する
										</button>
									</div>
									{editedFavoritePlayers.length > 0 ? (
										<div className="flex flex-wrap gap-x-2 gap-y-1.5">
											{editedFavoritePlayers.map((player) => (
												<FavoritePlayerImageCard
													key={player.id}
													player={player}
												/>
											))}
										</div>
									) : (
										<p className="text-sm text-slate-400">未選択です</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="mx-auto w-full max-w-[1070px] pt-4 pb-0 [font-family:Roboto,Arial,sans-serif] sm:pt-6">
					<div className="h-[118px] w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#76b8ff_0%,#86a8ff_25%,#7edac4_100%)] sm:h-[172px]" />
					<div className="relative mt-8 px-1 sm:px-0">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-9">
							<AuthorAvatar
								name={editedName}
								image={avatarImage}
								className="h-20 w-20 bg-white sm:h-30 sm:w-30"
								fallbackClassName="text-xl sm:text-3xl"
							/>
							<div className="min-w-0 flex-1 pt-1 space-y-1 sm:pt-2">
								<div className="flex items-start">
									<h1 className="min-w-0 flex-1 truncate text-[2rem] leading-[1.25] font-bold text-[#0f0f0f] sm:text-2xl sm:leading-[58px]">
										{editedName}
									</h1>
									<Button
										type="button"
										variant={isLogin ? "outline" : "default"}
										rounded="full"
										enableClickAnimation
										className={
											isLogin
												? "mt-0.5 h-9 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-[#0f0f0f] [@media(hover:hover)]:hover:bg-slate-100"
												: "mt-0.5 h-9 rounded-full bg-[#0f0f0f] px-4 text-sm font-medium text-white [@media(hover:hover)]:hover:bg-[#272727]"
										}
										disabled={isSavingProfile}
										onClick={isLogin ? onStartEditingAction : undefined}
									>
										{isLogin ? "プロフィールを編集" : "フォロー"}
									</Button>
								</div>
								<p className="line-clamp-1 whitespace-pre-line break-words text-sm text-[#0f0f0f] sm:text-[14px] sm:leading-[20px]">
									{editedBio}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
			<FavoritePlayersSelectDialog
				open={isFavoritePlayersDialogOpen}
				onOpenChangeAction={onFavoritePlayersDialogOpenChangeAction}
				players={favoritePlayerOptions}
				selectedPlayers={editedFavoritePlayers}
				isLoading={isLoadingFavoritePlayers}
				loadError={favoritePlayersLoadError}
				onReloadAction={onReloadFavoritePlayersAction}
				onApplySelectedPlayersAction={onSetFavoritePlayersAction}
			/>
		</section>
	);
}
