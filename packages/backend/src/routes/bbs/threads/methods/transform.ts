import type { TagType } from "@kotobad/shared/src/types/tag";
import type { ThreadType } from "@kotobad/shared/src/types/thread";

export type ThreadQueryResult = {
	id: number;
	title: string;
	createdAt: Date;
	updatedAt: Date | null;
	postCount: number;
	authorId: string;
	isPinned?: boolean;
	isClosed?: boolean;
	likeCount: number;
	likedByMe: boolean;
	author: {
		name: string;
		image?: string | null;
		bio?: string | null;
	};
	threadTags?: Array<{
		threadId: number;
		tagId: number;
		tags: TagType;
	}>;
	threadImages?: Array<{
		imageUrl: string;
		sortOrder: number;
	}>;
};

export const toThreadResponse = (thread: ThreadQueryResult): ThreadType => {
	const {
		threadTags: rawThreadTags,
		threadImages: rawThreadImages,
		...base
	} = thread;
	const threadTags = (rawThreadTags ?? []).map((threadTag) => threadTag.tags);
	const imageUrls = (rawThreadImages ?? [])
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.map((threadImage) => threadImage.imageUrl);

	return {
		...base,
		imageUrls,
		createdAt: base.createdAt.toISOString(),
		updatedAt: base.updatedAt ? base.updatedAt.toISOString() : null,
		threadTags,
	};
};
