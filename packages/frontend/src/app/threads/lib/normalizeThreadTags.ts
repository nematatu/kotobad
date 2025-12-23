const normalizeThreadTags = (
	thread: Record<string, unknown>,
): Record<string, unknown> => {
	if (Array.isArray(thread.threadTags)) {
		return thread;
	}
	if (Array.isArray(thread.threadLabels)) {
		const threadTags = thread.threadLabels
			.filter(
				(
					label,
				): label is {
					threadId: number;
					labelId: number;
					labels: { id: number; name: string };
				} =>
					typeof label === "object" &&
					label !== null &&
					"labels" in label &&
					"labelId" in label,
			)
			.map((label) => ({
				threadId: label.threadId,
				tagId: label.labelId,
				tags: label.labels,
			}));
		return { ...thread, threadTags };
	}
	return { ...thread, threadTags: [] };
};

export default normalizeThreadTags;
