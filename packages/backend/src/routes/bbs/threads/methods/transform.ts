import { z } from "@hono/zod-openapi";
import { OpenAPIThreadSchema } from "../../../../models/threads";

export type ThreadQueryResult = {
	id: number;
	title: string;
	createdAt: Date;
	updatedAt: Date | null;
	postCount: number;
	authorId: number;
	isPinned: boolean;
	isClosed: boolean;
	author?: {
		username?: string | null;
	};
	threadLabels?: Array<{
		threadId: number;
		labelId: number;
		labels?: {
			id: number;
			name: string;
		} | null;
	}>;
};

type ThreadLabelQueryResult = NonNullable<
	ThreadQueryResult["threadLabels"]
>[number];

export const toThreadResponse = <T extends ThreadQueryResult>(
	thread: T,
): z.infer<typeof OpenAPIThreadSchema> => {
	const threadLabels =
		thread.threadLabels
			?.filter(
				(
					label,
				): label is ThreadLabelQueryResult & {
					labels: { id: number; name: string };
				} => Boolean(label.labels),
			)
			.map((label) => ({
				threadId: label.threadId,
				labelId: label.labelId,
				labels: {
					id: label.labels.id,
					name: label.labels.name,
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
			username: thread.author?.username ?? undefined,
		},
		threadLabels,
	};
};
