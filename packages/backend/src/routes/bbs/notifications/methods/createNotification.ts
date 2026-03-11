import type { NotificationType } from "@kotobad/shared/src/types/notifications";
import { notifications } from "../../../../../drizzle/schema";
import type { AppEnvironment } from "../../../../types";

export const createNotification = async (
	db: AppEnvironment["Variables"]["db"],
	input: {
		recipientUserId: string;
		senderUserId: string;
		type: NotificationType;
		threadId?: number | null;
		targetPostId?: number | null;
		reactionEmoji?: string | null;
	},
) => {
	if (input.recipientUserId === input.senderUserId) return;

	await db.insert(notifications).values({
		recipientUserId: input.recipientUserId,
		senderUserId: input.senderUserId,
		type: input.type,
		threadId: input.threadId ?? null,
		targetPostId: input.targetPostId ?? null,
		reactionEmoji: input.reactionEmoji ?? null,
	});
};
