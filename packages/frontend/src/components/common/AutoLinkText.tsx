import { cn } from "@/lib/utils";
import { findTextUrlMatches } from "./autoLinkUtils";
import { normalizeYouTubeUrl } from "./youtubeUrlUtils";

type Props = {
	text: string;
	linkClassName?: string;
	hideYouTubeUrls?: boolean;
};

const pushTextWithLineBreaks = (
	nodes: React.ReactNode[],
	segment: string,
	keyPrefix: string,
) => {
	if (segment.length === 0) {
		return;
	}

	const lines = segment.split(/\r?\n/);
	for (const [index, line] of lines.entries()) {
		if (index > 0) {
			nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
		}
		if (line.length > 0) {
			nodes.push(line);
		}
	}
};

export function AutoLinkText({
	text,
	linkClassName,
	hideYouTubeUrls = false,
}: Props) {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	let keyIndex = 0;
	let hasUrlMatch = false;
	for (const match of findTextUrlMatches(text)) {
		const { index, matchedText, trailing, url } = match;
		hasUrlMatch = true;
		if (index > lastIndex) {
			pushTextWithLineBreaks(
				nodes,
				text.slice(lastIndex, index),
				`chunk-${keyIndex}-${lastIndex}`,
			);
		}

		const isYouTubeUrl = normalizeYouTubeUrl(url) !== null;
		if (!(hideYouTubeUrls && isYouTubeUrl)) {
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
			pushTextWithLineBreaks(
				nodes,
				trailing,
				`trailing-${keyIndex}-${lastIndex}`,
			);
		}

		lastIndex = index + matchedText.length;
	}

	if (lastIndex < text.length) {
		pushTextWithLineBreaks(
			nodes,
			text.slice(lastIndex),
			`tail-${keyIndex}-${lastIndex}`,
		);
	}

	if (nodes.length === 0 && !hasUrlMatch) {
		return <>{text}</>;
	}

	return <>{nodes}</>;
}
