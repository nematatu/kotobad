export function getRelativeDate(isoString: string): string {
	const date = new Date(isoString);
	const now = new Date();
	const diff = (date.getTime() - now.getTime()) / 1000;

	const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });

	if (Math.abs(diff) < 60) return "たった今";
	if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), "minute");
	if (Math.abs(diff) < 86400)
		return rtf.format(Math.round(diff / 3600), "hour");

	return rtf.format(Math.round(diff / 86400), "day");
}
