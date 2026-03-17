import type { PostType } from "@kotobad/shared/src/types/post";
import type { ReplyTarget } from "../types/replyTarget";

export const messageLayoutTransition = {
	duration: 0.24,
	ease: [0.22, 1, 0.36, 1] as const,
};

const chatDateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

const ONE_HOUR_SECONDS = 60 * 60;

export const formatChatTime = (createdAt: string, nowMs: number): string => {
	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const diffSeconds = Math.floor((nowMs - date.getTime()) / 1000);
	if (diffSeconds >= 0 && diffSeconds < 60) {
		return `${diffSeconds}秒前`;
	}

	if (diffSeconds >= 60 && diffSeconds < ONE_HOUR_SECONDS) {
		return `${Math.floor(diffSeconds / 60)}分前`;
	}

	return chatDateTimeFormatter.format(date);
};

export const getSelectedReactionCodes = (post: PostType): string[] => {
	const selectedReactionCodes: string[] = [];
	for (const reaction of post.reactions) {
		if (!reaction.reactedByMe) continue;
		selectedReactionCodes.push(reaction.reactionCode);
	}
	return selectedReactionCodes;
};

export const toReplyTarget = (post: PostType): ReplyTarget => ({
	postId: post.id,
	localId: post.localId,
	authorName: post.author.name,
});
