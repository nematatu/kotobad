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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/components/feature/provider/UserProvider";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffErrorMessage } from "@/lib/api/fetcher/errorPayload";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import {
	type EditableProfile,
	MAX_AVATAR_BYTES,
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
	editedFavoritePlayers: FavoritePlayerType[];
	isFavoritePlayersDialogOpen: boolean;
	favoritePlayerOptions: UserProfileSelectablePlayerType[];
	isLoadingFavoritePlayers: boolean;
	favoritePlayersLoadError: string | null;
	avatarInputRef: RefObject<HTMLInputElement | null>;
	startEditingAction: () => void;
	openConfirmAction: () => void;
	setIsConfirmOpenAction: (open: boolean) => void;
	cancelEditingAction: () => void;
	openAvatarFileDialogAction: () => void;
	changeAvatarFileAction: (event: ChangeEvent<HTMLInputElement>) => void;
	changeEditedNameAction: (value: string) => void;
	changeEditedBioAction: (value: string) => void;
	setIsFavoritePlayersDialogOpenAction: (open: boolean) => void;
	toggleFavoritePlayerAction: (player: UserProfileSelectablePlayerType) => void;
	removeFavoritePlayerAction: (playerId: number) => void;
	reloadFavoritePlayersAction: () => Promise<void>;
	confirmUpdateAction: () => Promise<void>;
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

const toFavoritePlayer = (
	player: UserProfileSelectablePlayerType,
): FavoritePlayerType => ({
	id: player.id,
	name: `${player.lastName} ${player.firstName}`,
	imageUrl: player.imageUrl ?? null,
});

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
	const [editedFavoritePlayers, setEditedFavoritePlayers] = useState<
		FavoritePlayerType[]
	>(savedProfile.favoritePlayers);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const previewAvatarUrlRef = useRef<string | null>(null);
	const avatarInputRef = useRef<HTMLInputElement | null>(null);
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
		setEditedFavoritePlayers(nextProfile.favoritePlayers);
	};

	const closeEditUi = () => {
		setIsFavoritePlayersDialogOpen(false);
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
		setEditedFavoritePlayers(nextSavedProfile.favoritePlayers);
		setIsSavingProfile(false);
		setIsConfirmOpen(false);
		setIsEditing(false);
		setIsFavoritePlayersDialogOpen(false);
	}, [profile]);

	useEffect(() => {
		return () => {
			revokeObjectUrl(previewAvatarUrlRef.current);
			previewAvatarUrlRef.current = null;
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
		if (!isEditing || isSavingProfile) return;
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

	const toggleFavoritePlayerAction = (
		player: UserProfileSelectablePlayerType,
	) => {
		if (!isEditing || isSavingProfile) return;
		const exists = editedFavoritePlayers.some((item) => item.id === player.id);
		if (exists) {
			setEditedFavoritePlayers((current) =>
				current.filter((item) => item.id !== player.id),
			);
			return;
		}
		if (editedFavoritePlayers.length >= MAX_FAVORITE_PLAYERS) {
			toast.error("好きな選手は3人まで選択できます");
			return;
		}
		setEditedFavoritePlayers((current) => [
			...current,
			toFavoritePlayer(player),
		]);
	};

	const removeFavoritePlayerAction = (playerId: number) => {
		if (!isEditing || isSavingProfile) return;
		setEditedFavoritePlayers((current) =>
			current.filter((item) => item.id !== playerId),
		);
	};

	const confirmUpdateAction = async () => {
		if (isSavingProfile) return;

		const trimmedName = editedName.trim();
		const hasNameChanged = trimmedName !== savedProfile.name;
		const hasBioChanged = editedBio !== savedProfile.bio;
		const hasImageChanged = avatarFile !== null;
		const hasFavoritePlayersChanged = !hasSameFavoritePlayers(
			editedFavoritePlayers,
			savedProfile.favoritePlayers,
		);
		const hasChanges =
			hasNameChanged ||
			hasBioChanged ||
			hasImageChanged ||
			hasFavoritePlayersChanged;

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
		} catch (error: unknown) {
			toast.error(
				getBffErrorMessage(error) ?? "プロフィール更新に失敗しました",
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
		editedFavoritePlayers,
		isFavoritePlayersDialogOpen,
		favoritePlayerOptions,
		isLoadingFavoritePlayers,
		favoritePlayersLoadError,
		avatarInputRef,
		startEditingAction: () => setIsEditing(true),
		openConfirmAction: () => setIsConfirmOpen(true),
		setIsConfirmOpenAction: setIsConfirmOpen,
		cancelEditingAction,
		openAvatarFileDialogAction,
		changeAvatarFileAction,
		changeEditedNameAction: setEditedName,
		changeEditedBioAction: setEditedBio,
		setIsFavoritePlayersDialogOpenAction,
		toggleFavoritePlayerAction,
		removeFavoritePlayerAction,
		reloadFavoritePlayersAction,
		confirmUpdateAction,
	};
};
