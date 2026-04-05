const URL_PATTERN = /https?:\/\/[^\s<>"'`]+/g;
const TRAILING_PUNCTUATION_PATTERN =
	/[.,!?;:)\]｝）】〉》」』、。，．！？；：]$/;

type TextUrlMatch = {
	index: number;
	matchedText: string;
	url: string;
	trailing: string;
};

function splitUrlAndTrailing(text: string): {
	url: string;
	trailing: string;
} {
	let url = text;
	let trailing = "";
	while (url.length > 0 && TRAILING_PUNCTUATION_PATTERN.test(url)) {
		const lastChar = url.slice(-1);
		trailing = `${lastChar}${trailing}`;
		url = url.slice(0, -1);
	}
	return { url, trailing };
}

export function findTextUrlMatches(text: string): TextUrlMatch[] {
	const matches: TextUrlMatch[] = [];
	for (const match of text.matchAll(URL_PATTERN)) {
		const index = match.index;
		if (typeof index !== "number") {
			continue;
		}
		const matchedText = match[0];
		const { url, trailing } = splitUrlAndTrailing(matchedText);
		if (url.length === 0) {
			continue;
		}
		matches.push({
			index,
			matchedText,
			url,
			trailing,
		});
	}
	return matches;
}
