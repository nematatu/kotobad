import type { PostType } from "@kotobad/shared/src/types/post";
import type { PostReactionType } from "@kotobad/shared/src/types/reaction";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { postReactions, reactions } from "../../../../../drizzle/schema";
import type { AppEnvironment } from "../../../../types";

type PostQueryItem = Omit<PostType, "reactions" | "createdAt" | "updatedAt"> & {
	createdAt: Date;
	updatedAt: Date | null;
	threadId: number;
};

type props = {
	db: AppEnvironment["Variables"]["db"];
	posts: PostQueryItem[];
};

export async function getPostReactions({ db, posts }: props) {
	const postIds = posts.map((post) => post.id);
	const reactionRows =
		postIds.length === 0
			? []
			: await db
					.select({
						postId: postReactions.postId,
						id: reactions.id,
						reactionCode: reactions.code,
						emoji: reactions.emoji,
						sortOrder: reactions.sortOrder,
						count: sql<number>`count(*)`,
						reactedByMe: sql<number>`0`,
					})
					// 1. postReactions を reactions と結合し、
					// postIdsに含まれるポストを抽出。
					.from(postReactions)
					.innerJoin(reactions, eq(postReactions.reactionId, reactions.id))
					.where(inArray(postReactions.postId, postIds))
					// 2. 抽出したポストに対する、リアクションを集計する。
					// そのために、同じポストID, リアクションIDなどをグループ化する。
					.groupBy(
						postReactions.postId,
						reactions.id,
						reactions.code,
						reactions.emoji,
						reactions.sortOrder,
					)
					.orderBy(asc(postReactions.postId), asc(reactions.sortOrder));

	const reactionMap = new Map<number, PostReactionType[]>();
	for (const row of reactionRows) {
		const list = reactionMap.get(row.postId) ?? [];
		list.push({
			id: row.id,
			reactionCode: row.reactionCode,
			emoji: row.emoji,
			count: row.count,
			reactedByMe: row.reactedByMe === 1,
			sortOrder: row.sortOrder,
		});
		reactionMap.set(row.postId, list);
	}

	return reactionMap;
}

export async function getPostReactionsByPost({
	db,
	post,
}: {
	db: AppEnvironment["Variables"]["db"];
	post: PostQueryItem;
}) {
	const map = await getPostReactions({ db, posts: [post] });
	return map;
}
