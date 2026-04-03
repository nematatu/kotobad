"use client";

import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
} from "@kotobad/shared/src/types/user";
import { Camera, Check, Loader2, X } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import IconButton from "@/components/common/button/IconButton";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Button } from "@/components/ui/button";
import {
	MAX_PROFILE_BIO_LENGTH,
	MAX_PROFILE_NAME_LENGTH,
} from "../lib/profileEditor";
import { FavoritePlayersSelectDialog } from "./FavoritePlayersSelectDialog";

type EditorCardViewModel = {
	isLogin: boolean;
	isEditing: boolean;
	isSavingProfile: boolean;
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
					<div className="relative mt-8 px-1 sm:px-0">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-9">
							<div className="group relative inline-flex">
								<AuthorAvatar
									name={editedName}
									image={avatarImage}
									className="h-20 w-20 bg-white sm:h-30 sm:w-30"
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
							<div className="min-w-0 flex-1 space-y-1.5 sm:pt-1">
								<div className="flex w-full items-start gap-3">
									<div className="group relative min-w-0 w-full max-w-[34rem] rounded-md border border-[#d9d9d9] bg-white px-3 pt-4 pb-1.5 transition-colors focus-within:border-[#1d9bf0]">
										<label
											htmlFor="name"
											className="pointer-events-none absolute top-2.5 left-3 text-[11px] text-[#606060] transition-colors group-focus-within:text-[#1d9bf0]"
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
											className="h-9 w-full border-0 bg-transparent px-0 py-0 text-[1.9rem] leading-[1.2] font-bold text-[#0f0f0f] outline-none focus:ring-0 sm:h-14 sm:text-2xl sm:leading-[52px]"
										/>
										<p className="pointer-events-none absolute right-3 bottom-1 text-[11px] text-slate-400">
											{editedName.length}/{MAX_PROFILE_NAME_LENGTH}
										</p>
									</div>
									<div className="mt-0.5 ml-auto flex shrink-0 items-center gap-2">
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
								<div className="group relative mt-0.5 w-full max-w-2xl rounded-md border border-[#d9d9d9] bg-white px-3 pt-5 pb-4 transition-colors focus-within:border-[#1d9bf0]">
									<label
										htmlFor="bio"
										className="pointer-events-none absolute top-2.5 left-3 text-[11px] text-[#606060] transition-colors group-focus-within:text-[#1d9bf0]"
									>
										自己紹介
									</label>
									<input
										id="bio"
										value={editedBio}
										onChange={(event) =>
											onEditedBioChangeAction(event.target.value)
										}
										maxLength={MAX_PROFILE_BIO_LENGTH}
										className="h-9 w-full border-0 bg-transparent px-0 py-0 text-sm leading-[1.2] text-[#0f0f0f] outline-none focus:ring-0 sm:h-10 sm:text-[17px] sm:leading-[52px]"
									/>
									<p className="pointer-events-none absolute right-3 bottom-1 text-[11px] text-slate-400">
										{editedBio.length}/{MAX_PROFILE_BIO_LENGTH}
									</p>
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
										variant={isLogin ? "outline" : "default"}
										rounded="full"
										enableClickAnimation
										asChild={isLogin}
										className={
											isLogin
												? "mt-0.5 h-9 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-[#0f0f0f] [@media(hover:hover)]:hover:bg-slate-100"
												: "mt-0.5 h-9 rounded-full bg-[#0f0f0f] px-4 text-sm font-medium text-white [@media(hover:hover)]:hover:bg-[#272727]"
										}
										disabled={isSavingProfile}
									>
										{isLogin ? (
											<Link href="/settings/profile" showIndicator={false}>
												プロフィールを編集
											</Link>
										) : (
											"フォロー"
										)}
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
