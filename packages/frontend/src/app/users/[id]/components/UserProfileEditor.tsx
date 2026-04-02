"use client";

import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { useUserProfileEditor } from "../hooks/useUserProfileEditor";
import { UserProfileEditorCard } from "./UserProfileEditorCard";
import { UserProfileUpdateConfirmDialog } from "./UserProfileUpdateConfirmDialog";

type Props = {
	profile: UserProfileType;
};

export function UserProfileEditor({ profile }: Props) {
	const {
		isLogin,
		isEditing,
		isConfirmOpen,
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
		startEditingAction,
		openConfirmAction,
		setIsConfirmOpenAction,
		cancelEditingAction,
		openAvatarFileDialogAction,
		changeAvatarFileAction,
		changeEditedNameAction,
		changeEditedBioAction,
		setIsFavoritePlayersDialogOpenAction,
		setFavoritePlayersAction,
		reloadFavoritePlayersAction,
		confirmUpdateAction,
	} = useUserProfileEditor(profile);

	const viewModel = {
		isLogin,
		isEditing,
		isSavingProfile,
		profileId: profile.id,
		createdAt: profile.createdAt,
		threadCount: profile.threadCount,
		postCount: profile.postCount,
		favoritePlayerCount: editedFavoritePlayers.length,
		editedName,
		editedBio,
		avatarImage,
		editedFavoritePlayers,
		isFavoritePlayersDialogOpen,
		favoritePlayerOptions,
		isLoadingFavoritePlayers,
		favoritePlayersLoadError,
		avatarInputRef,
	};

	const actions = {
		onStartEditingAction: startEditingAction,
		onOpenConfirmAction: openConfirmAction,
		onCancelEditingAction: cancelEditingAction,
		onOpenAvatarFileDialogAction: openAvatarFileDialogAction,
		onAvatarFileChangeAction: changeAvatarFileAction,
		onEditedNameChangeAction: changeEditedNameAction,
		onEditedBioChangeAction: changeEditedBioAction,
		onFavoritePlayersDialogOpenChangeAction:
			setIsFavoritePlayersDialogOpenAction,
		onSetFavoritePlayersAction: setFavoritePlayersAction,
		onReloadFavoritePlayersAction: reloadFavoritePlayersAction,
	};

	return (
		<>
			<UserProfileEditorCard viewModel={viewModel} actions={actions} />
			<UserProfileUpdateConfirmDialog
				open={isConfirmOpen}
				onOpenChangeAction={setIsConfirmOpenAction}
				isSavingProfile={isSavingProfile}
				profileId={profile.id}
				previewName={editedName}
				previewBio={editedBio}
				previewAvatarImage={avatarImage}
				previewFavoritePlayers={editedFavoritePlayers}
				onConfirmAction={confirmUpdateAction}
			/>
		</>
	);
}
