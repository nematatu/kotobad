import { inArray, sql } from "drizzle-orm";
import { threadLikes } from "../../../../../drizzle/schema";
import type { AppEnvironment } from "../../../../types";

type ThreadLikeSummary = {
	likeCount: number;
	likedByMe: boolean;
};

type Params = {
	db: AppEnvironment["Variables"]["db"];
	threadIds: number[];
	viewerUserId: string | null;
};

export async function getThreadLikeSummaryMap({
	db,
	threadIds,
	viewerUserId,
}: Params): Promise<Map<number, ThreadLikeSummary>> {
	if (threadIds.length === 0) {
		return new Map();
	}

	const likedByMeExpr = viewerUserId
		? sql<number>`max(case when ${threadLikes.userId} = ${viewerUserId} then 1 else 0 end)`
		: sql<number>`0`;

	const rows = await db
		.select({
			threadId: threadLikes.threadId,
			likeCount: sql<number>`count(*)`,
			likedByMe: likedByMeExpr,
		})
		.from(threadLikes)
		.where(inArray(threadLikes.threadId, threadIds))
		.groupBy(threadLikes.threadId);

	const likeMap = new Map<number, ThreadLikeSummary>();
	for (const row of rows) {
		likeMap.set(row.threadId, {
			likeCount: row.likeCount,
			likedByMe: row.likedByMe === 1,
		});
	}

	return likeMap;
}
