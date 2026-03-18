import { cn } from "@/lib/utils";
import { findTextUrlMatches } from "./autoLinkUtils";
import { normalizeYouTubeUrl } from "./youtubeUrlUtils";

type Props = {
	text: string;
	linkClassName?: string;
	hideYouTubeUrls?: boolean;
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
			nodes.push(text.slice(lastIndex, index));
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
			nodes.push(trailing);
		}

		lastIndex = index + matchedText.length;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	if (nodes.length === 0 && !hasUrlMatch) {
		return <>{text}</>;
	}

	return <>{nodes}</>;
}
