import { cn } from "@/lib/utils";

type Props = {
	text: string;
	linkClassName?: string;
};

const URL_PATTERN = /https?:\/\/[^\s<>"'`]+/g;
const TRAILING_PUNCTUATION_PATTERN =
	/[.,!?;:)\]｝）】〉》」』、。，．！？；：]$/;

function splitUrlAndTrailing(text: string): { url: string; trailing: string } {
	let url = text;
	let trailing = "";
	while (url.length > 0 && TRAILING_PUNCTUATION_PATTERN.test(url)) {
		const lastChar = url.slice(-1);
		trailing = `${lastChar}${trailing}`;
		url = url.slice(0, -1);
	}
	return { url, trailing };
}

export function AutoLinkText({ text, linkClassName }: Props) {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	let keyIndex = 0;

	for (const match of text.matchAll(URL_PATTERN)) {
		const index = match.index;
		if (typeof index !== "number") {
			continue;
		}

		const matchedText = match[0];
		if (index > lastIndex) {
			nodes.push(text.slice(lastIndex, index));
		}

		const { url, trailing } = splitUrlAndTrailing(matchedText);
		if (url.length > 0) {
			nodes.push(
				<a
					key={`auto-link-${keyIndex}`}
					href={url}
					target="_blank"
					rel="noreferrer noopener"
					className={cn(
						"underline underline-offset-2 text-blue-600 hover:text-blue-700 break-all",
						linkClassName,
					)}
				>
					{url}
				</a>,
			);
			keyIndex += 1;
		}

		if (trailing.length > 0) {
			nodes.push(trailing);
		}

		lastIndex = index + matchedText.length;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	if (nodes.length === 0) {
		return <>{text}</>;
	}

	return <>{nodes}</>;
}
