import type { DeveloperNoteType } from "@kotobad/shared/src/types/developerNote";

export type DeveloperNoteQueryResult = Omit<
	DeveloperNoteType,
	"createdAt" | "updatedAt" | "author"
> & {
	createdAt: Date;
	updatedAt: Date | null;
	author?: {
		name?: string | null;
		image?: string | null;
	} | null;
};

export const toDeveloperNoteResponse = (
	note: DeveloperNoteQueryResult,
): DeveloperNoteType => ({
	...note,
	createdAt: note.createdAt.toISOString(),
	updatedAt: note.updatedAt ? note.updatedAt.toISOString() : null,
	author: {
		name: note.author?.name ?? "開発者",
		image: note.author?.image ?? null,
	},
});
