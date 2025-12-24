export const parseApiErrorMessage = (value: unknown): string | null => {
	if (!value || typeof value !== "object") {
		return null;
	}
	const maybeError = (value as Record<string, unknown>).error;
	return typeof maybeError === "string" ? maybeError : null;
};
