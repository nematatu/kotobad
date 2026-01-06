import normalizeThreadTags from "./normalizeThreadTags";

const normalizeThread = (
	thread: Record<string, unknown>,
): Record<string, unknown> => {
	const normalizedThread = normalizeThreadTags(thread);
	const rawAuthor =
		typeof normalizedThread.author === "object" &&
		normalizedThread.author !== null
			? (normalizedThread.author as Record<string, unknown>)
			: {};
	const rawName = rawAuthor.name;
	const authorName =
		typeof rawName === "string" && rawName.trim().length > 0 ? rawName : "不明";

	return {
		...normalizedThread,
		author: {
			...rawAuthor,
			name: authorName,
		},
	};
};

export default normalizeThread;
