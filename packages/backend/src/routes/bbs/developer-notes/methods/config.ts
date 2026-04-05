import type { AppEnvironment } from "../../../../types";

const splitAuthorIds = (value?: string) =>
	value
		?.split(",")
		.map((authorId) => authorId.trim())
		.filter(Boolean) ?? [];

const getDeveloperNoteAllowedAuthorIds = (env: AppEnvironment["Bindings"]) =>
	new Set(splitAuthorIds(env.DEVELOPER_NOTE_AUTHOR_IDS));

export const canCreateDeveloperNote = (
	env: AppEnvironment["Bindings"],
	userId: string | null | undefined,
) => {
	if (!userId) {
		return false;
	}

	return getDeveloperNoteAllowedAuthorIds(env).has(userId);
};
