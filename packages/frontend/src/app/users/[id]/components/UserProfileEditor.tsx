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
		avatarInputRef,
		startEditingAction,
		openConfirmAction,
		setIsConfirmOpenAction,
		cancelEditingAction,
		openAvatarFileDialogAction,
		changeAvatarFileAction,
		changeEditedNameAction,
		changeEditedBioAction,
		confirmUpdateAction,
	} = useUserProfileEditor(profile);

	const viewModel = {
		isLogin,
		isEditing,
		isSavingProfile,
		profileId: profile.id,
		createdAt: profile.createdAt,
		editedName,
		editedBio,
		avatarImage,
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
	};

	return (
		<>
			<UserProfileEditorCard viewModel={viewModel} actions={actions} />
			<UserProfileUpdateConfirmDialog
				open={isConfirmOpen}
				onOpenChangeAction={setIsConfirmOpenAction}
				isSavingProfile={isSavingProfile}
				onConfirmAction={confirmUpdateAction}
			/>
		</>
	);
}
