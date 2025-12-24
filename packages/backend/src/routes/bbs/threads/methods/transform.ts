import type { ThreadType } from "@kotobad/shared/src/types/thread";

export type ThreadQueryResult = Omit<ThreadType, "createdAt" | "updatedAt"> & {
	createdAt: Date;
	updatedAt: Date | null;
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
