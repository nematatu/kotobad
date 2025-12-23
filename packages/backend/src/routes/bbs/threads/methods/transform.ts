import type { z } from "@hono/zod-openapi";
import type { OpenAPIThreadSchema } from "../../../../models/threads";

export type ThreadQueryResult = {
	id: number;
	title: string;
	createdAt: Date;
	updatedAt: Date | null;
	postCount: number;
	authorId: string;
	isPinned: boolean;
	isClosed: boolean;
	author?: {
		name?: string | null;
	};
	threadTags?: Array<{
		threadId: number;
		tagId: number;
		tags?: {
			id: number;
			name: string;
		} | null;
	}>;
};

type ThreadTagQueryResult = NonNullable<
	ThreadQueryResult["threadTags"]
>[number];

export const toThreadResponse = <T extends ThreadQueryResult>(
	thread: T,
): z.infer<typeof OpenAPIThreadSchema> => {
	const threadTags =
		thread.threadTags
			?.filter(
				(
					tag,
				): tag is ThreadTagQueryResult & {
					tags: { id: number; name: string };
				} => Boolean(tag),
			)
			.map((tag) => ({
				threadId: tag.threadId,
				tagId: tag.tagId,
				tags: {
					id: tag.tags.id,
					name: tag.tags.name,
				},
			})) ?? [];

	return {
		id: thread.id,
		title: thread.title,
		createdAt: thread.createdAt.toISOString(),
		updatedAt: thread.updatedAt ? thread.updatedAt.toISOString() : null,
		postCount: thread.postCount,
		authorId: thread.authorId,
		isPinned: thread.isPinned,
		isClosed: thread.isClosed,
		author: {
			username: thread.author?.name ?? undefined,
		},
		threadTags,
	};
};
