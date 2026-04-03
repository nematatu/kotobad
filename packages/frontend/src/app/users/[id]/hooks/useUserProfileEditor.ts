"use client";

import {
	UpdateUserProfileResponseSchema,
	UserProfileSelectablePlayersSchema,
} from "@kotobad/shared/src/schemas/user";
import type {
	FavoritePlayerType,
	UserProfileSelectablePlayerType,
	UserProfileType,
} from "@kotobad/shared/src/types/user";
import type { ChangeEvent, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/components/feature/provider/UserProvider";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffErrorMessage } from "@/lib/api/fetcher/errorPayload";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import {
	type EditableProfile,
	MAX_AVATAR_BYTES,
	MAX_HEADER_IMAGE_BYTES,
	toEditableProfile,
} from "../lib/profileEditor";

const MAX_FAVORITE_PLAYERS = 3;

type UseUserProfileEditorResult = {
	isLogin: boolean;
	isEditing: boolean;
	isConfirmOpen: boolean;
	isSavingProfile: boolean;
	editedName: string;
	editedBio: string;
	avatarImage: string | null;
	headerImage: string | null;
	editedFavoritePlayers: FavoritePlayerType[];
	isFavoritePlayersDialogOpen: boolean;
	favoritePlayerOptions: UserProfileSelectablePlayerType[];
	isLoadingFavoritePlayers: boolean;
	favoritePlayersLoadError: string | null;
	avatarInputRef: RefObject<HTMLInputElement | null>;
	headerImageInputRef: RefObject<HTMLInputElement | null>;
	startEditingAction: () => void;
	openConfirmAction: () => void;
	setIsConfirmOpenAction: (open: boolean) => void;
	cancelEditingAction: () => void;
	openAvatarFileDialogAction: () => void;
	changeAvatarFileAction: (event: ChangeEvent<HTMLInputElement>) => void;
	openHeaderImageFileDialogAction: () => void;
	changeHeaderImageFileAction: (event: ChangeEvent<HTMLInputElement>) => void;
	changeEditedNameAction: (value: string) => void;
	changeEditedBioAction: (value: string) => void;
	setIsFavoritePlayersDialogOpenAction: (open: boolean) => void;
	setFavoritePlayersAction: (players: FavoritePlayerType[]) => void;
	reloadFavoritePlayersAction: () => Promise<void>;
	confirmUpdateAction: () => Promise<boolean>;
	hasChanges: boolean;
};

const revokeObjectUrl = (objectUrl: string | null) => {
	if (!objectUrl) return;
	URL.revokeObjectURL(objectUrl);
};

const hasSameFavoritePlayers = (
	left: FavoritePlayerType[],
	right: FavoritePlayerType[],
) =>
	left.length === right.length &&
	left.every((player, index) => right[index]?.id === player.id);

export const useUserProfileEditor = (
	profile: UserProfileType,
	options?: { alwaysEditing?: boolean },
): UseUserProfileEditorResult => {
	const { user, setUser } = useUser();
	const isLogin = user?.id === profile.id;
	const alwaysEditing = options?.alwaysEditing === true;
	const [isEditing, setIsEditing] = useState(alwaysEditing);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [savedProfile, setSavedProfile] = useState<EditableProfile>(
		toEditableProfile(profile),
	);
	const [editedName, setEditedName] = useState(savedProfile.name);
	const [editedBio, setEditedBio] = useState(savedProfile.bio);
	const [avatarImage, setAvatarImage] = useState<string | null>(
		savedProfile.image,
	);
	const [headerImage, setHeaderImage] = useState<string | null>(
		savedProfile.headerImage,
	);
	const [editedFavoritePlayers, setEditedFavoritePlayers] = useState<
		FavoritePlayerType[]
	>(savedProfile.favoritePlayers);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const previewAvatarUrlRef = useRef<string | null>(null);
	const previewHeaderImageUrlRef = useRef<string | null>(null);
	const avatarInputRef = useRef<HTMLInputElement | null>(null);
	const headerImageInputRef = useRef<HTMLInputElement | null>(null);
	const [isFavoritePlayersDialogOpen, setIsFavoritePlayersDialogOpen] =
		useState(false);
	const [favoritePlayerOptions, setFavoritePlayerOptions] = useState<
		UserProfileSelectablePlayerType[]
	>([]);
	const [isLoadingFavoritePlayers, setIsLoadingFavoritePlayers] =
		useState(false);
	const [favoritePlayersLoadError, setFavoritePlayersLoadError] = useState<
		string | null
	>(null);
	const hasLoadedFavoritePlayersRef = useRef(false);

	const canEdit = alwaysEditing || isEditing;

	const trimmedName = editedName.trim();
	const hasNameChanged = trimmedName !== savedProfile.name;
	const hasBioChanged = editedBio !== savedProfile.bio;
	const hasImageChanged = avatarFile !== null;
	const hasHeaderImageChanged = headerImageFile !== null;
	const hasFavoritePlayersChanged = !hasSameFavoritePlayers(
		editedFavoritePlayers,
		savedProfile.favoritePlayers,
	);
	const hasChanges =
		hasNameChanged ||
		hasBioChanged ||
		hasImageChanged ||
		hasHeaderImageChanged ||
		hasFavoritePlayersChanged;

	const clearPreviewAvatarUrl = useCallback(() => {
		revokeObjectUrl(previewAvatarUrlRef.current);
		previewAvatarUrlRef.current = null;
	}, []);

	const clearPreviewHeaderImageUrl = useCallback(() => {
		revokeObjectUrl(previewHeaderImageUrlRef.current);
		previewHeaderImageUrlRef.current = null;
	}, []);

	const applyDraft = useCallback(
		(nextProfile: EditableProfile) => {
			clearPreviewAvatarUrl();
			clearPreviewHeaderImageUrl();
			setAvatarFile(null);
			setHeaderImageFile(null);
			setEditedName(nextProfile.name);
			setEditedBio(nextProfile.bio);
			setAvatarImage(nextProfile.image);
			setHeaderImage(nextProfile.headerImage);
			setEditedFavoritePlayers(nextProfile.favoritePlayers);
		},
		[clearPreviewAvatarUrl, clearPreviewHeaderImageUrl],
	);

	const closeEditUi = () => {
		setIsFavoritePlayersDialogOpen(false);
		setIsConfirmOpen(false);
		if (!alwaysEditing) {
			setIsEditing(false);
		}
	};

	useEffect(() => {
		const nextSavedProfile = toEditableProfile(profile);
		setSavedProfile(nextSavedProfile);
		applyDraft(nextSavedProfile);
		setIsSavingProfile(false);
		setIsConfirmOpen(false);
		if (!alwaysEditing) {
			setIsEditing(false);
		}
		setIsFavoritePlayersDialogOpen(false);
	}, [profile, applyDraft, alwaysEditing]);

	useEffect(() => {
		return () => {
			revokeObjectUrl(previewAvatarUrlRef.current);
			previewAvatarUrlRef.current = null;
			revokeObjectUrl(previewHeaderImageUrlRef.current);
			previewHeaderImageUrlRef.current = null;
		};
	}, []);

	const reloadFavoritePlayersAction = async () => {
		setIsLoadingFavoritePlayers(true);
		setFavoritePlayersLoadError(null);
		try {
			const endpoint = await getBffApiUrl("GET_PROFILE_PLAYERS");
			endpoint.searchParams.set("limit", "400");
			const raw = await BffFetcher<unknown>(endpoint, { method: "GET" });
			const response = UserProfileSelectablePlayersSchema.parse(raw);
			setFavoritePlayerOptions(response.players);
			hasLoadedFavoritePlayersRef.current = true;
		} catch (error: unknown) {
			const message =
				getBffErrorMessage(error) ?? "選手一覧の取得に失敗しました";
			setFavoritePlayersLoadError(message);
		} finally {
			setIsLoadingFavoritePlayers(false);
		}
	};

	const setIsFavoritePlayersDialogOpenAction = (open: boolean) => {
		if (!canEdit || isSavingProfile) return;
		setIsFavoritePlayersDialogOpen(open);
		if (
			open &&
			!hasLoadedFavoritePlayersRef.current &&
			!isLoadingFavoritePlayers
		) {
			void reloadFavoritePlayersAction();
		}
	};

	const openAvatarFileDialogAction = () => {
		if (!canEdit || isSavingProfile) return;
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

	const openHeaderImageFileDialogAction = () => {
		if (!canEdit || isSavingProfile) return;
		headerImageInputRef.current?.click();
	};

	const changeHeaderImageFileAction = (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (file.size <= 0) {
			toast.error("ファイルが空です");
			return;
		}

		if (file.size > MAX_HEADER_IMAGE_BYTES) {
			toast.error("6MB以下の画像を選択してください");
			return;
		}
		const previewUrl = URL.createObjectURL(file);
		clearPreviewHeaderImageUrl();
		previewHeaderImageUrlRef.current = previewUrl;
		setHeaderImageFile(file);
		setHeaderImage(previewUrl);
	};

	const setFavoritePlayersAction = (players: FavoritePlayerType[]) => {
		if (!canEdit || isSavingProfile) return;
		setEditedFavoritePlayers(players.slice(0, MAX_FAVORITE_PLAYERS));
	};

	const confirmUpdateAction = async () => {
		if (isSavingProfile) return false;

		if (!hasChanges) {
			closeEditUi();
			return true;
		}

		if (trimmedName.length === 0) {
			toast.error("名前を入力してください");
			return false;
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
			if (headerImageFile) {
				formData.append("headerImage", headerImageFile);
			}
			if (hasFavoritePlayersChanged) {
				formData.append("favoritePlayersTouched", "1");
				for (const player of editedFavoritePlayers) {
					formData.append("favoritePlayerIds", String(player.id));
				}
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
			return true;
		} catch (error: unknown) {
			toast.error(
				getBffErrorMessage(error) ?? "プロフィール更新に失敗しました",
			);
			return false;
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
		isEditing: canEdit,
		isConfirmOpen,
		isSavingProfile,
		editedName,
		editedBio,
		avatarImage,
		headerImage,
		editedFavoritePlayers,
		isFavoritePlayersDialogOpen,
		favoritePlayerOptions,
		isLoadingFavoritePlayers,
		favoritePlayersLoadError,
		avatarInputRef,
		headerImageInputRef,
		startEditingAction: () => {
			if (alwaysEditing) return;
			setIsEditing(true);
		},
		openConfirmAction: () => setIsConfirmOpen(true),
		setIsConfirmOpenAction: setIsConfirmOpen,
		cancelEditingAction,
		openAvatarFileDialogAction,
		changeAvatarFileAction,
		openHeaderImageFileDialogAction,
		changeHeaderImageFileAction,
		changeEditedNameAction: setEditedName,
		changeEditedBioAction: setEditedBio,
		setIsFavoritePlayersDialogOpenAction,
		setFavoritePlayersAction,
		reloadFavoritePlayersAction,
		confirmUpdateAction,
		hasChanges,
	};
};
