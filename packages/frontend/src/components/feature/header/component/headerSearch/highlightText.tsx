const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const highlightText = (threadTitle: string, query: string) => {
	const trimmed = query.trim();
	if (!trimmed) return threadTitle;
	const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "gi");
	const parts = threadTitle.split(regex);
	let cursor = 0;
	let isMatch = false;
	return parts.map((part) => {
		const key = `${cursor}-${part}`;
		// text = "総合総合たのしみ"、q = "総合" なら、
		// split の結果は↓
		// ["", "総合", "", "総合", "たのしみ"]
		// splitの対象が奇数番目に入ることを利用
		const shouldHighlight = isMatch;
		isMatch = !isMatch;
		cursor += part.length;
		return shouldHighlight ? (
			<mark
				key={key}
				className="rounded-[2px] bg-yellow-200 px-0.5 text-slate-900"
			>
				{part}
			</mark>
		) : (
			<span key={key}>{part}</span>
		);
	});
};
