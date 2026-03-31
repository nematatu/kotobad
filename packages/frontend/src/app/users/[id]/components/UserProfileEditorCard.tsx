"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { Camera, Check, Loader2, Pencil } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import IconButton from "@/components/common/button/IconButton";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	MAX_PROFILE_BIO_LENGTH,
	MAX_PROFILE_NAME_LENGTH,
} from "../lib/profileEditor";
import { FavoritePlayersSelectDialog } from "./FavoritePlayersSelectDialog";

type EditorCardViewModel = {
	isLogin: boolean;
	isEditing: boolean;
	isSavingProfile: boolean;
	profileId: string;
	createdAt: string;
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
	onToggleFavoritePlayerAction: (
		player: UserProfileSelectablePlayerType,
	) => void;
	onRemoveFavoritePlayerAction: (playerId: number) => void;
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
		onToggleFavoritePlayerAction,
		onRemoveFavoritePlayerAction,
		onReloadFavoritePlayersAction,
	} = actions;

	return (
		<section className="relative overflow-hidden bg-white">
			<div className="h-24 bg-[linear-gradient(135deg,#93c5fd_0%,#dbeafe_42%,#cffafe_100%)] sm:h-32" />
			{isLogin && (
				<div className="absolute top-2 right-2 flex-1">
					<IconButton
						variant="logo1"
						icon={isEditing ? <Check /> : <Pencil />}
						rounded="full"
						enableClickAnimation
						hover="brightness"
						className="transition-colors text-slate-100"
						disabled={isSavingProfile}
						onClick={isEditing ? onOpenConfirmAction : onStartEditingAction}
					>
						<span className="">{isEditing ? "完了" : "編集"}</span>
					</IconButton>
				</div>
			)}
			<div className="-mt-12 px-4 pb-6 sm:-mt-14 sm:px-6">
				<div className="group relative inline-flex">
					<AuthorAvatar
						name={editedName}
						image={avatarImage}
						className="h-24 w-24 border-4 border-white sm:h-28 sm:w-28"
						fallbackClassName="text-lg"
					/>
					{isLogin && isEditing && (
						<button
							type="button"
							className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full border-4 border-white bg-black/30 text-white transition-colors hover:bg-black/25"
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
					)}
					<input
						ref={avatarInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
						className="hidden"
						onChange={onAvatarFileChangeAction}
					/>
				</div>
				<div className="space-y-4">
					<div className="mt-3 flex flex-col flex-wrap gap-x-3 gap-y-1">
						{isEditing ? (
							<input
								type="text"
								value={editedName}
								onChange={(event) =>
									onEditedNameChangeAction(event.target.value)
								}
								maxLength={MAX_PROFILE_NAME_LENGTH}
								className="h-10 w-full max-w-md rounded-md border border-slate-300 bg-white px-3 text-xl font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 sm:text-2xl"
							/>
						) : (
							<h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
								{editedName}
							</h1>
						)}
						<span
							className="text-xs text-slate-400 sm:text-sm"
							title={profileId}
						>
							@{profileId}
						</span>
					</div>
					<div className="space-y-2">
						{isEditing ? (
							<>
								<textarea
									value={editedBio}
									onChange={(event) =>
										onEditedBioChangeAction(event.target.value)
									}
									maxLength={MAX_PROFILE_BIO_LENGTH}
									rows={4}
									placeholder="自己紹介を入力"
									className="w-full max-w-2xl rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 sm:text-sm"
								/>
								<div className="flex items-center justify-between">
									<p className="text-xs text-slate-400">
										{editedBio.length}/{MAX_PROFILE_BIO_LENGTH}
									</p>
									<button
										type="button"
										className="text-xs text-slate-500 hover:text-slate-700"
										disabled={isSavingProfile}
										onClick={onCancelEditingAction}
									>
										キャンセル
									</button>
								</div>
							</>
						) : (
							<p className="mt-2 text-sm text-slate-600">{editedBio}</p>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-xs font-medium text-slate-500">好きな選手</p>
							{isEditing ? (
								<button
									type="button"
									className="text-sm text-blue-600"
									onClick={() => onFavoritePlayersDialogOpenChangeAction(true)}
								>
									選択する
								</button>
							) : null}
						</div>
						{editedFavoritePlayers.length === 0 ? (
							<p className="text-sm text-slate-400">未選択です</p>
						) : (
							<div className="flex flex-wrap gap-2">
								{editedFavoritePlayers.map((player) => (
									<div
										key={player.id}
										className="rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-sm text-blue-900"
									>
										{player.name}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
				<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
					<span className="rounded-full bg-slate-100 px-2 py-1">
						登録日: {formatDate(createdAt, { withTime: false })}
					</span>
				</div>
			</div>
			<FavoritePlayersSelectDialog
				open={isFavoritePlayersDialogOpen}
				onOpenChangeAction={onFavoritePlayersDialogOpenChangeAction}
				players={favoritePlayerOptions}
				selectedPlayers={editedFavoritePlayers}
				isLoading={isLoadingFavoritePlayers}
				loadError={favoritePlayersLoadError}
				onReloadAction={onReloadFavoritePlayersAction}
				onTogglePlayerAction={onToggleFavoritePlayerAction}
				onRemovePlayerAction={onRemoveFavoritePlayerAction}
			/>
		</section>
	);
}
