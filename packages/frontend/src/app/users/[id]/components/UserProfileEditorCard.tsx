"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { Camera, Check, Loader2, Pencil, X } from "lucide-react";
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
		<section
			className={`relative overflow-hidden bg-white ${isEditing ? "pb-12" : ""}`}
		>
			<div className="h-24 bg-[linear-gradient(135deg,#93c5fd_0%,#dbeafe_42%,#cffafe_100%)] sm:h-32" />
			{isLogin && isEditing ? (
				<div className="absolute bottom-3 right-3 flex-1 flex items-center gap-2">
					<IconButton
						variant="outline"
						icon={<X />}
						rounded="full"
						enableClickAnimation
						className="bg-transparent border border-slate-500 [@media(hover:hover)]:hover:!bg-slate-100/80"
						disabled={isSavingProfile}
						onClick={onCancelEditingAction}
					>
						<span className="font-bold">キャンセル</span>
					</IconButton>

					<IconButton
						variant="logo1"
						icon={<Check />}
						rounded="full"
						enableClickAnimation
						hover="brightness"
						className="transition-colors text-slate-100"
						disabled={isSavingProfile}
						onClick={onOpenConfirmAction}
					>
						<span className="font-bold">完了</span>
					</IconButton>
				</div>
			) : (
				<div className="absolute top-3 right-3 flex-1 flex items-center gap-2">
					<IconButton
						variant="logo1"
						icon={<Pencil />}
						rounded="full"
						enableClickAnimation
						hover="brightness"
						className="transition-colors text-slate-100"
						disabled={isSavingProfile}
						onClick={onStartEditingAction}
					>
						<span className="font-bold">編集</span>
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
							<div className="group relative w-full max-w-md rounded-md border border-slate-300 bg-white transition-colors focus-within:!border-blue-600">
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
									className="h-14 w-full overflow-hidden rounded-md border-0 bg-transparent px-3 pt-6 pb-5 text-[20px] font-bold text-slate-900 outline-none focus:ring-0"
								/>
								<span className="pointer-events-none absolute right-3 bottom-1 text-[11px] text-slate-400">
									{editedName.length}/{MAX_PROFILE_NAME_LENGTH}
								</span>
							</div>
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
							<div className="group relative w-full max-w-2xl rounded-md border border-slate-300 bg-white transition-colors focus-within:!border-blue-600">
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
									rows={4}
									className="w-full resize-none overflow-y-auto rounded-md border-0 bg-transparent px-3 pt-7 pb-6 text-base text-slate-700 outline-none focus:ring-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:text-sm"
								/>
								<span className="pointer-events-none absolute right-3 bottom-1 text-[11px] text-slate-400">
									{editedBio.length}/{MAX_PROFILE_BIO_LENGTH}
								</span>
							</div>
						) : (
							<p className="mt-2 text-sm text-slate-600">{editedBio}</p>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center">
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
							<div className="flex flex-wrap gap-x-2 gap-y-1.5">
								{editedFavoritePlayers.map((player) => (
									<div
										key={player.id}
										className="flex w-[5.25rem] flex-col items-start gap-0.5 text-left"
									>
										<AuthorAvatar
											name={player.name}
											image={player.imageUrl}
											className="h-16 w-16 rounded-md bg-white"
											fallbackClassName="rounded-md text-xs"
											imageClassName="scale-120"
										/>
										<span className="text-xs leading-tight text-slate-700">
											{player.name}
										</span>
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
				onApplySelectedPlayersAction={onSetFavoritePlayersAction}
			/>
		</section>
	);
}
