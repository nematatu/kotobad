import type { DeveloperNoteType } from "@kotobad/shared/src/types/developerNote";

type DeveloperNoteQueryResult = {
	id: number;
	content: string;
	createdAt: Date;
	updatedAt: Date | null;
	authorId: string;
	label?: {
		id: number;
		code: string;
		name: string;
	} | null;
	author?: {
		name?: string | null;
		image?: string | null;
	} | null;
};

export const toDeveloperNoteResponse = (
	note: DeveloperNoteQueryResult,
): DeveloperNoteType => {
	return {
		id: note.id,
		content: note.content,
		createdAt: note.createdAt.toISOString(),
		updatedAt: note.updatedAt ? note.updatedAt.toISOString() : null,
		authorId: note.authorId,
		author: {
			name: note.author?.name ?? "開発者",
			image: note.author?.image ?? null,
		},
		label: note.label
			? {
					id: note.label.id,
					code: note.label.code,
					name: note.label.name,
				}
			: null,
	};
};
