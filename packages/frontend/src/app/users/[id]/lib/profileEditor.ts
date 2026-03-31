import type { FavoritePlayerType } from "@kotobad/shared/src/types/user";

export type EditableProfile = {
	name: string;
	bio: string;
	image: string | null;
	favoritePlayers: FavoritePlayerType[];
};

export const MAX_PROFILE_NAME_LENGTH = 20;
export const MAX_PROFILE_BIO_LENGTH = 240;
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const toEditableProfile = (profile: {
	name: string;
	bio: string | null | undefined;
	image?: string | null;
	favoritePlayers?: FavoritePlayerType[] | null;
}): EditableProfile => ({
	name: profile.name,
	bio: profile.bio ?? "",
	image: profile.image ?? null,
	favoritePlayers: profile.favoritePlayers ?? [],
});
