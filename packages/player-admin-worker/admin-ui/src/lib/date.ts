export const epochSecondsToDateInput = (value: number | null): string => {
	if (typeof value !== "number") {
		return "";
	}
	const date = new Date(value * 1000);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return date.toISOString().slice(0, 10);
};
