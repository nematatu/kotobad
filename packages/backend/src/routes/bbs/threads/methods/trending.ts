import { inArray, sql } from "drizzle-orm";
import { threadLikes, threadTrends } from "../../../../../drizzle/schema";
import type { AppEnvironment } from "../../../../types";

const TREND_SOURCE_LIMIT = 240;
const TREND_STORED_LIMIT = 80;
const TREND_RECENCY_HALF_LIFE_HOURS = 36;
const TREND_POST_WEIGHT = 1.9;
const TREND_LIKE_WEIGHT = 2.4;
const TREND_FRESHNESS_WEIGHT = 3.2;

type ThreadTrendDb = AppEnvironment["Variables"]["db"];

export const TREND_DEFAULT_LIMIT = 8;
export const TREND_MAX_LIMIT = 20;

const calculateTrendScore = ({
	postCount,
	likeCount,
	activityDate,
	nowMs,
}: {
	postCount: number;
	likeCount: number;
	activityDate: Date;
	nowMs: number;
}) => {
	const ageHours = Math.max(
		0,
		(nowMs - activityDate.getTime()) / (1000 * 60 * 60),
	);
	const freshness = Math.exp(-ageHours / TREND_RECENCY_HALF_LIFE_HOURS);
	const engagementScore =
		Math.log1p(postCount) * TREND_POST_WEIGHT +
		Math.log1p(likeCount) * TREND_LIKE_WEIGHT;

	return (
		engagementScore * (1 + freshness) +
		freshness * TREND_FRESHNESS_WEIGHT +
		(postCount > 0 ? 0.25 : 0)
	);
};

export const refreshThreadTrends = async ({
	db,
	runAt = new Date(),
}: {
	db: ThreadTrendDb;
	runAt?: Date;
}): Promise<number> => {
	const sourceThreads = await db.query.threads.findMany({
		columns: {
			id: true,
			postCount: true,
			createdAt: true,
			updatedAt: true,
		},
		limit: TREND_SOURCE_LIMIT,
		orderBy: (threads, { desc }) => [
			desc(threads.updatedAt),
			desc(threads.createdAt),
			desc(threads.id),
		],
	});

	if (sourceThreads.length === 0) {
		return 0;
	}

	const likeRows = await db
		.select({
			threadId: threadLikes.threadId,
			likeCount: sql<number>`count(*)`,
		})
		.from(threadLikes)
		.where(
			inArray(
				threadLikes.threadId,
				sourceThreads.map((thread) => thread.id),
			),
		)
		.groupBy(threadLikes.threadId);

	const likeCountMap = new Map(
		likeRows.map((row) => [row.threadId, row.likeCount]),
	);
	const nowMs = runAt.getTime();
	const rankedRows = sourceThreads
		.map((thread) => {
			const likeCount = likeCountMap.get(thread.id) ?? 0;
			const activityDate = thread.updatedAt ?? thread.createdAt;
			const trendScore = calculateTrendScore({
				postCount: thread.postCount,
				likeCount,
				activityDate,
				nowMs,
			});

			return {
				threadId: thread.id,
				postCount: thread.postCount,
				trendScore,
			};
		})
		.sort((a, b) => {
			if (b.trendScore !== a.trendScore) {
				return b.trendScore - a.trendScore;
			}
			if (b.postCount !== a.postCount) {
				return b.postCount - a.postCount;
			}
			return b.threadId - a.threadId;
		})
		.slice(0, TREND_STORED_LIMIT)
		.map((row, index) => ({
			threadId: row.threadId,
			rank: index + 1,
			scoreMilli: Math.round(row.trendScore * 1000),
			calculatedAt: runAt,
		}));

	for (const row of rankedRows) {
		await db
			.insert(threadTrends)
			.values(row)
			.onConflictDoUpdate({
				target: threadTrends.threadId,
				set: {
					rank: row.rank,
					scoreMilli: row.scoreMilli,
					calculatedAt: row.calculatedAt,
				},
			});
	}

	return rankedRows.length;
};

export const getLatestThreadTrends = async ({
	db,
	limit,
}: {
	db: ThreadTrendDb;
	limit: number;
}) => {
	const latestSnapshot = await db.query.threadTrends.findFirst({
		columns: {
			calculatedAt: true,
		},
		orderBy: (threadTrends, { desc }) => [desc(threadTrends.calculatedAt)],
	});

	if (!latestSnapshot) {
		return [];
	}

	return db.query.threadTrends.findMany({
		where: (threadTrends, { eq }) =>
			eq(threadTrends.calculatedAt, latestSnapshot.calculatedAt),
		orderBy: (threadTrends, { asc, desc }) => [
			asc(threadTrends.rank),
			desc(threadTrends.scoreMilli),
			asc(threadTrends.threadId),
		],
		limit,
	});
};
