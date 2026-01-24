"use client";

import type { ThreadType } from "@kotobad/shared/src/types/thread";

export type ThreadPreview = {
	id: ThreadType["id"];
	title: ThreadType["title"];
	createdAt: ThreadType["createdAt"];
	threadTags?: ThreadType["threadTags"];
};

const threadPreviewCache = new Map<string, ThreadPreview>();

export const setThreadPreview = (thread: ThreadType) => {
	threadPreviewCache.set(String(thread.id), {
		id: thread.id,
		title: thread.title,
		createdAt: thread.createdAt,
		threadTags: thread.threadTags,
	});
};

export const getThreadPreview = (id: string | number | undefined) => {
	if (!id) return null;
	return threadPreviewCache.get(String(id)) ?? null;
};
