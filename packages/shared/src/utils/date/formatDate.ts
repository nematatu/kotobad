type FormatDateOptions = {
	withTime?: boolean;
};

export function formatDate(
	isoString: string,
	options: FormatDateOptions = {},
): string {
	const date = new Date(isoString);
	const withTime = options.withTime ?? true;

	const formatter = new Intl.DateTimeFormat(
		"ja-Jp",
		withTime
			? {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}
			: {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				},
	);

	return formatter.format(date);
}
