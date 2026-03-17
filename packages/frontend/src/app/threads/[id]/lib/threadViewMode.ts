export const threadViewModes = ["thread", "chat"] as const;

export type ThreadViewMode = (typeof threadViewModes)[number];

const threadViewModeSet: ReadonlySet<string> = new Set(threadViewModes);

const isThreadViewMode = (value: string): value is ThreadViewMode =>
	threadViewModeSet.has(value);

export const parseThreadViewMode = (
	value: string | null | undefined,
): ThreadViewMode => {
	if (value && isThreadViewMode(value)) return value;
	return "thread";
};

export const threadViewModeLabel: Record<ThreadViewMode, string> = {
	thread: "スレッド",
	chat: "チャット",
};
