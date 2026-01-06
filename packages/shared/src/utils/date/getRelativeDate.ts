type RelativeDateRes = {
	isDisplay: boolean;
	relativeDate: string;
};

export function getRelativeDate(isoString: string): RelativeDateRes {
	const res: RelativeDateRes = {
		isDisplay: true,
		relativeDate: "",
	};
	const date = new Date(isoString);
	const now = new Date();
	const diff = (date.getTime() - now.getTime()) / 1000;

	const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });
	const abs = Math.abs(diff);

	if (abs < 60) res.relativeDate = "たった今";
	else if (abs < 3600)
		res.relativeDate = rtf.format(Math.round(diff / 60), "minute");
	else if (abs < 86400)
		res.relativeDate = rtf.format(Math.round(diff / 3600), "hour");
	else res.relativeDate = rtf.format(Math.round(diff / 86400), "day");

	// 10日以上は絶対時間を表示
	if (Math.abs(diff) > 864000) res.isDisplay = false;
	return res;
}
