import type { TagType } from "@kotobad/shared/src/types/tag";
import type { ThreadType } from "@kotobad/shared/src/types/thread";

export type ThreadQueryResult = Omit<
	ThreadType,
	"createdAt" | "updatedAt" | "author" | "threadTags"
> & {
	createdAt: Date;
	updatedAt: Date | null;
	author: {
		name: string;
		image?: string | null;
	};
	threadTags?: Array<{
		threadId: number;
		tagId: number;
		tags: TagType;
	}>;
};
export const toThreadResponse = (thread: ThreadQueryResult): ThreadType => {
	const threadTags = (thread.threadTags ?? []).map(
		(threadTag) => threadTag.tags,
	);

	return {
		...thread,
		createdAt: thread.createdAt.toISOString(),
		updatedAt: thread.updatedAt ? thread.updatedAt.toISOString() : null,
		threadTags,
	};
};
