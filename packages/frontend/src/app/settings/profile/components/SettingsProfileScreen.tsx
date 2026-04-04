"use client";

import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { Loader2 } from "lucide-react";
import { Josefin_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { Button } from "@/components/ui/button";
import { FavoritePlayerImageCard } from "../../../users/[id]/components/FavoritePlayerImageCard";
import { FavoritePlayersSelectDialog } from "../../../users/[id]/components/FavoritePlayersSelectDialog";
import { HeaderImageCropDialog } from "../../../users/[id]/components/HeaderImageCropDialog";
import { ProfileHeaderImage } from "../../../users/[id]/components/ProfileHeaderImage";
import { useUserProfileEditor } from "../../../users/[id]/hooks/useUserProfileEditor";
import {
	MAX_PROFILE_BIO_LENGTH,
	MAX_PROFILE_NAME_LENGTH,
} from "../../../users/[id]/lib/profileEditor";

const settingsHeadingFont = Josefin_Sans({
	subsets: ["latin"],
	weight: ["700"],
	display: "swap",
});

function SettingsProfileForm({ profile }: { profile: UserProfileType }) {
	const router = useRouter();
	const {
		editedName,
		editedBio,
		avatarImage,
		headerImage,
		editedFavoritePlayers,
		isSavingProfile,
		avatarInputRef,
		headerImageInputRef,
		isFavoritePlayersDialogOpen,
		favoritePlayerOptions,
		isLoadingFavoritePlayers,
		favoritePlayersLoadError,
		isHeaderImageCropDialogOpen,
		headerImageCropSourceFile,
		openAvatarFileDialogAction,
		changeAvatarFileAction,
		openHeaderImageFileDialogAction,
		changeHeaderImageFileAction,
		closeHeaderImageCropDialogAction,
		applyHeaderImageCropAction,
		changeEditedNameAction,
		changeEditedBioAction,
		setIsFavoritePlayersDialogOpenAction,
		setFavoritePlayersAction,
		reloadFavoritePlayersAction,
		confirmUpdateAction,
		cancelEditingAction,
	} = useUserProfileEditor(profile, { alwaysEditing: true });

	const profileHref = `/users/${encodeURIComponent(profile.id)}`;

	const handleCancel = () => {
		cancelEditingAction();
		router.push(profileHref);
	};

	const handleSaveAndBack = async () => {
		const ok = await confirmUpdateAction();
		if (!ok) return;
		router.push(profileHref);
	};

	return (
		<>
			<section className="mx-auto w-full max-w-[1120px] overflow-hidden">
				<div className="border-b border-[#e3eaf2] px-6 py-5 dark:border-slate-800 sm:px-10">
					<h1
						className={`${settingsHeadingFont.className} mt-1 text-[34px] leading-none font-bold tracking-[0.06em] text-[#2f3439] dark:text-slate-100 sm:text-[40px]`}
					>
						Settings
					</h1>
				</div>

				<div className="px-6 py-8 sm:px-10">
					<div className="mx-auto max-w-[960px]">
						<div className="mb-6">
							<div className="relative">
								<ProfileHeaderImage
									headerImage={headerImage}
									alt="プロフィールヘッダー画像"
									sizes="(max-width: 640px) calc(100vw - 3rem), 960px"
									className="rounded-lg border border-[#d6dde6] dark:border-slate-700"
									fallbackClassName="rounded-lg border border-[#d6dde6] dark:border-slate-700"
								/>
								<div className="hidden sm:absolute sm:top-3 sm:right-3 sm:block">
									<Button
										type="button"
										variant="outline"
										className="font-semibold text-[#4b647e] transition-colors [@media(hover:hover)]:hover:text-[#1d9bf0] dark:border-slate-500 dark:bg-slate-800 dark:text-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-700"
										onClick={openHeaderImageFileDialogAction}
										disabled={isSavingProfile}
									>
										ヘッダー画像を変更する
									</Button>
								</div>
							</div>
							<div className="mt-3 flex justify-center sm:hidden">
								<Button
									type="button"
									variant="outline"
									className="font-semibold text-[#4b647e] transition-colors [@media(hover:hover)]:hover:text-[#1d9bf0] dark:border-slate-500 dark:bg-slate-800 dark:text-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-700"
									onClick={openHeaderImageFileDialogAction}
									disabled={isSavingProfile}
								>
									ヘッダー画像を変更する
								</Button>
							</div>
							<input
								ref={headerImageInputRef}
								type="file"
								accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
								className="hidden"
								onChange={changeHeaderImageFileAction}
							/>
						</div>
						<div className="grid gap-6 sm:grid-cols-[minmax(0,0.4fr)_1px_minmax(0,1.1fr)] sm:gap-0">
							<div className="p-4 sm:px-8 sm:py-5">
								<div className="flex flex-col items-center gap-6">
									<AuthorAvatar
										name={editedName}
										image={avatarImage}
										className="h-22 w-22"
										fallbackClassName="text-xl"
									/>
									<Button
										variant="outline"
										size="lg"
										className="font-semibold text-[#4b647e] transition-colors [@media(hover:hover)]:hover:text-[#1d9bf0] dark:border-slate-500 dark:bg-slate-800 dark:text-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-700"
										onClick={openAvatarFileDialogAction}
										disabled={isSavingProfile}
									>
										画像を変更する
									</Button>
								</div>
								<input
									ref={avatarInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
									className="hidden"
									onChange={changeAvatarFileAction}
								/>
							</div>

							<div className="hidden w-px bg-[#e3eaf2] dark:bg-slate-800 sm:block" />

							<div className="space-y-8 p-4 sm:px-8 sm:py-5">
								<div>
									<label
										htmlFor="settings-profile-name"
										className="mb-3 block text-[13px] font-semibold text-[#38414a] dark:text-slate-200"
									>
										表示名
									</label>
									<div className="relative">
										<input
											id="settings-profile-name"
											value={editedName}
											onChange={(event) =>
												changeEditedNameAction(event.target.value)
											}
											maxLength={MAX_PROFILE_NAME_LENGTH}
											className="h-12 w-full rounded-lg border border-[#d6dde6] bg-[#f7f9fc] px-3 text-base text-[#2f3439] outline-none transition-colors focus:border-[#1d9bf0] focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900 sm:text-[15px]"
										/>
										<span className="pointer-events-none absolute right-3 bottom-2 text-[11px] text-[#97a3b0] dark:text-slate-400">
											{editedName.length}/{MAX_PROFILE_NAME_LENGTH}
										</span>
									</div>
								</div>

								<div>
									<label
										htmlFor="settings-profile-bio"
										className="mb-3 block text-[13px] font-semibold text-[#38414a] dark:text-slate-200"
									>
										自己紹介
									</label>
									<div className="relative">
										<textarea
											id="settings-profile-bio"
											value={editedBio}
											onChange={(event) =>
												changeEditedBioAction(event.target.value)
											}
											maxLength={MAX_PROFILE_BIO_LENGTH}
											rows={3}
											className="w-full rounded-lg border border-[#d6dde6] bg-[#f7f9fc] px-3 py-2 text-base text-[#2f3439] resize-none outline-none transition-colors focus:border-[#1d9bf0] focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900 sm:text-[15px]"
										/>
										<span className="pointer-events-none absolute right-3 bottom-3 text-[11px] text-[#97a3b0] dark:text-slate-400">
											{editedBio.length}/{MAX_PROFILE_BIO_LENGTH}
										</span>
									</div>
								</div>

								<div>
									<div className="mb-3">
										<p className="text-[13px] font-semibold text-[#38414a] dark:text-slate-200">
											推し選手
										</p>
									</div>
									{editedFavoritePlayers.length > 0 ? (
										<div className="flex flex-wrap justify-center gap-3">
											{editedFavoritePlayers.map((player) => (
												<FavoritePlayerImageCard
													key={player.id}
													player={player}
													enablePreview
												/>
											))}
										</div>
									) : (
										<p className="text-sm text-[#8a98a8] dark:text-slate-400">
											選択されていません
										</p>
									)}
									<div className="mt-5 flex justify-center">
										<Button
											variant="outline"
											size="lg"
											className="font-semibold text-[#4b647e] transition-colors [@media(hover:hover)]:hover:text-[#1d9bf0] dark:border-slate-500 dark:bg-slate-800 dark:text-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-700"
											onClick={() => setIsFavoritePlayersDialogOpenAction(true)}
										>
											推し選手を選択する
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="mx-auto mt-10 flex w-full max-w-[960px] items-center justify-center gap-5">
						<Button
							type="button"
							variant="outline"
							className="h-10 rounded-md border-[#cfd8e3] bg-white px-4 text-sm font-semibold text-[#304050] [@media(hover:hover)]:hover:bg-[#f7f9fc] dark:border-slate-500 dark:bg-slate-800 dark:text-slate-50 dark:[@media(hover:hover)]:hover:bg-slate-700"
							onClick={handleCancel}
							disabled={isSavingProfile}
						>
							キャンセル
						</Button>
						<Button
							type="button"
							variant="zenn-like"
							className="h-10 rounded-md px-5 text-sm font-bold text-white"
							onClick={() => void handleSaveAndBack()}
							disabled={isSavingProfile}
						>
							{isSavingProfile ? (
								<span className="inline-flex items-center gap-1.5">
									<Loader2 className="h-4 w-4 animate-spin" />
									更新中
								</span>
							) : (
								"更新して戻る"
							)}
						</Button>
					</div>
				</div>
			</section>

			<FavoritePlayersSelectDialog
				open={isFavoritePlayersDialogOpen}
				onOpenChangeAction={setIsFavoritePlayersDialogOpenAction}
				players={favoritePlayerOptions}
				selectedPlayers={editedFavoritePlayers}
				isLoading={isLoadingFavoritePlayers}
				loadError={favoritePlayersLoadError}
				onReloadAction={reloadFavoritePlayersAction}
				onApplySelectedPlayersAction={setFavoritePlayersAction}
			/>
			<HeaderImageCropDialog
				open={isHeaderImageCropDialogOpen}
				file={headerImageCropSourceFile}
				onCloseAction={closeHeaderImageCropDialogAction}
				onApplyAction={applyHeaderImageCropAction}
			/>
		</>
	);
}

export function SettingsProfileScreen({
	profile,
}: {
	profile: UserProfileType;
}) {
	return <SettingsProfileForm profile={profile} />;
}
