export type EditableProfile = {
	name: string;
	bio: string;
	image: string | null;
};

export const MAX_PROFILE_NAME_LENGTH = 20;
export const MAX_PROFILE_BIO_LENGTH = 240;
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const toEditableProfile = (profile: {
	name: string;
	bio: string | null | undefined;
	image?: string | null;
}): EditableProfile => ({
	name: profile.name,
	bio: profile.bio ?? "",
	image: profile.image ?? null,
});

export const getFetcherErrorMessage = (error: unknown): string | null => {
	const body = (error as { body?: unknown })?.body;
	if (typeof body !== "string") {
		return null;
	}

	try {
		const parsed = JSON.parse(body) as {
			error?: string;
			message?: string;
		};
		return parsed.message ?? parsed.error ?? null;
	} catch {
		return null;
	}
};
