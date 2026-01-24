import type { ThreadType } from "@kotobad/shared/src/types/thread";

export type ThreadQueryResult = Omit<
	ThreadType,
	"createdAt" | "updatedAt" | "author"
> & {
	createdAt: Date;
	updatedAt: Date | null;
	author: {
		name: string;
		image?: string | null;
	};
};
export const toThreadResponse = (thread: ThreadQueryResult): ThreadType => {
	const threadTags = thread.threadTags ?? [];

	return {
		...thread,
		createdAt: thread.createdAt.toISOString(),
		updatedAt: thread.updatedAt ? thread.updatedAt.toISOString() : null,
		threadTags,
	};
};
