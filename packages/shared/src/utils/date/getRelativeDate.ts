export function getRelativeDate(isoString: string) {
	const date = new Date(isoString);
	const now = new Date();
	const diff = (date.getTime() - now.getTime()) / 1000;

	const rtf = new Intl.RelativeTimeFormat("ja-JP-u-nu-latn", {
		numeric: "always",
	});
	const abs = Math.abs(diff);

	const toAsciiDigits = (value: string) =>
		value.replace(/[０-９]/g, (digit) =>
			String.fromCharCode(digit.charCodeAt(0) - 0xfee0),
		);

	const normalizeSpacing = (value: string) =>
		value.replace(/(\d)\s+([^\d\s])/g, "$1\u200A$2");

	const format = (seconds: number, unit: Intl.RelativeTimeFormatUnit) =>
		normalizeSpacing(
			toAsciiDigits(rtf.format(Math.round(diff / seconds), unit)),
		);

	if (abs < 60) return "たった今";
	if (abs < 3600) return format(60, "minute");
	if (abs < 86400) return format(3600, "hour");
	if (abs < 604800) return format(86400, "day");
	if (abs < 2592000) return format(604800, "week");
	if (abs < 31536000) return format(2592000, "month");
	return format(31536000, "year");
}
