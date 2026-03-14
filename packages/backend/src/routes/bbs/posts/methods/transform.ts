import type { PostType } from "@kotobad/shared/src/types/post";
import type { PostReactionType } from "@kotobad/shared/src/types/reaction";

export type PostQueryResult = {
	id: number;
	localId: number;
	post: string;
	authorId: string;
	replyToPostId?: number | null;
	createdAt: Date;
	updatedAt: Date | null;
	author: {
		name: string;
		image?: string | null;
	};
	postImages?: Array<{
		imageUrl: string;
		sortOrder: number;
	}>;
	reactions?: PostReactionType[];
	replyCount?: number;
};

export const toPostResponse = (post: PostQueryResult): PostType => {
	const { postImages: rawPostImages, reactions, replyCount, ...base } = post;
	const imageUrls = (rawPostImages ?? [])
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.map((postImage) => postImage.imageUrl);

	return {
		...base,
		imageUrls,
		createdAt: base.createdAt.toISOString(),
		updatedAt: base.updatedAt ? base.updatedAt.toISOString() : null,
		reactions: reactions ?? [],
		replyCount: replyCount ?? 0,
	};
};
