"use client";

import { UpdateUserProfileResponseSchema } from "@kotobad/shared/src/schemas/user";
import type { UserProfileType } from "@kotobad/shared/src/types/user";
import type { ChangeEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/components/feature/provider/UserProvider";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import {
	type EditableProfile,
	getFetcherErrorMessage,
	MAX_AVATAR_BYTES,
	toEditableProfile,
} from "../lib/profileEditor";

type UseUserProfileEditorResult = {
	isLogin: boolean;
	isEditing: boolean;
	isConfirmOpen: boolean;
	isSavingProfile: boolean;
	editedName: string;
	editedBio: string;
	avatarImage: string | null;
	avatarInputRef: RefObject<HTMLInputElement | null>;
	startEditingAction: () => void;
	openConfirmAction: () => void;
	setIsConfirmOpenAction: (open: boolean) => void;
	cancelEditingAction: () => void;
	openAvatarFileDialogAction: () => void;
	changeAvatarFileAction: (event: ChangeEvent<HTMLInputElement>) => void;
	changeEditedNameAction: (value: string) => void;
	changeEditedBioAction: (value: string) => void;
	confirmUpdateAction: () => Promise<void>;
};

const revokeObjectUrl = (objectUrl: string | null) => {
	if (!objectUrl) return;
	URL.revokeObjectURL(objectUrl);
};

export const useUserProfileEditor = (
	profile: UserProfileType,
): UseUserProfileEditorResult => {
	const { user, setUser } = useUser();
	const isLogin = user?.id === profile.id;
	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [savedProfile, setSavedProfile] = useState<EditableProfile>(
		toEditableProfile(profile),
	);
	const [editedName, setEditedName] = useState(savedProfile.name);
	const [editedBio, setEditedBio] = useState(savedProfile.bio);
	const [avatarImage, setAvatarImage] = useState<string | null>(
		savedProfile.image,
	);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const previewAvatarUrlRef = useRef<string | null>(null);
	const avatarInputRef = useRef<HTMLInputElement | null>(null);

	const clearPreviewAvatarUrl = () => {
		revokeObjectUrl(previewAvatarUrlRef.current);
		previewAvatarUrlRef.current = null;
	};

	const applyDraft = (nextProfile: EditableProfile) => {
		clearPreviewAvatarUrl();
		setAvatarFile(null);
		setEditedName(nextProfile.name);
		setEditedBio(nextProfile.bio);
		setAvatarImage(nextProfile.image);
	};

	const closeEditUi = () => {
		setIsConfirmOpen(false);
		setIsEditing(false);
	};

	useEffect(() => {
		const nextSavedProfile = toEditableProfile(profile);
		setSavedProfile(nextSavedProfile);
		revokeObjectUrl(previewAvatarUrlRef.current);
		previewAvatarUrlRef.current = null;
		setAvatarFile(null);
		setEditedName(nextSavedProfile.name);
		setEditedBio(nextSavedProfile.bio);
		setAvatarImage(nextSavedProfile.image);
		setIsSavingProfile(false);
		setIsConfirmOpen(false);
		setIsEditing(false);
	}, [profile]);

	useEffect(() => {
		return () => {
			revokeObjectUrl(previewAvatarUrlRef.current);
			previewAvatarUrlRef.current = null;
		};
	}, []);

	const openAvatarFileDialogAction = () => {
		if (!isEditing || isSavingProfile) return;
		avatarInputRef.current?.click();
	};

	const changeAvatarFileAction = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (file.size <= 0) {
			toast.error("ファイルが空です");
			return;
		}

		if (file.size > MAX_AVATAR_BYTES) {
			toast.error("2MB以下の画像を選択してください");
			return;
		}

		const previewUrl = URL.createObjectURL(file);
		clearPreviewAvatarUrl();
		previewAvatarUrlRef.current = previewUrl;
		setAvatarFile(file);
		setAvatarImage(previewUrl);
	};

	const confirmUpdateAction = async () => {
		if (isSavingProfile) return;

		const trimmedName = editedName.trim();
		const hasNameChanged = trimmedName !== savedProfile.name;
		const hasBioChanged = editedBio !== savedProfile.bio;
		const hasImageChanged = avatarFile !== null;
		const hasChanges = hasNameChanged || hasBioChanged || hasImageChanged;

		if (!hasChanges) {
			closeEditUi();
			return;
		}

		if (trimmedName.length === 0) {
			toast.error("名前を入力してください");
			return;
		}

		setIsSavingProfile(true);
		try {
			const endpoint = await getBffApiUrl("UPDATE_MY_PROFILE");
			const formData = new FormData();
			if (hasNameChanged) {
				formData.append("name", trimmedName);
			}
			if (hasBioChanged) {
				formData.append("bio", editedBio);
			}
			if (avatarFile) {
				formData.append("image", avatarFile);
			}

			const raw = await BffFetcher<unknown>(endpoint, {
				method: "PATCH",
				body: formData,
			});
			const response = UpdateUserProfileResponseSchema.parse(raw);
			const nextSavedProfile = toEditableProfile(response.user);
			setSavedProfile(nextSavedProfile);
			applyDraft(nextSavedProfile);
			closeEditUi();

			if (user) {
				setUser({
					...user,
					name: nextSavedProfile.name,
					image: nextSavedProfile.image,
				});
			}

			toast.success(
				response.updated
					? "プロフィールを更新しました"
					: "更新対象はありませんでした",
			);
		} catch (error: unknown) {
			toast.error(
				getFetcherErrorMessage(error) ?? "プロフィール更新に失敗しました",
			);
		} finally {
			setIsSavingProfile(false);
		}
	};

	const cancelEditingAction = () => {
		applyDraft(savedProfile);
		closeEditUi();
	};

	return {
		isLogin,
		isEditing,
		isConfirmOpen,
		isSavingProfile,
		editedName,
		editedBio,
		avatarImage,
		avatarInputRef,
		startEditingAction: () => setIsEditing(true),
		openConfirmAction: () => setIsConfirmOpen(true),
		setIsConfirmOpenAction: setIsConfirmOpen,
		cancelEditingAction,
		openAvatarFileDialogAction,
		changeAvatarFileAction,
		changeEditedNameAction: setEditedName,
		changeEditedBioAction: setEditedBio,
		confirmUpdateAction,
	};
};
