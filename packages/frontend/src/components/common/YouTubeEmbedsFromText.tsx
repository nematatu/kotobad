"use client";

import { cn } from "@/lib/utils";
import { YouTubeEmbedPlayer } from "./YouTubeEmbedPlayer";
import { collectYouTubeUrlsFromText } from "./youtubeUrlUtils";

type Props = {
	text: string;
	className?: string;
	playerClassName?: string;
};

export function YouTubeEmbedsFromText({
	text,
	className,
	playerClassName,
}: Props) {
	const youtubeUrls = collectYouTubeUrlsFromText(text);
	if (youtubeUrls.length === 0) {
		return null;
	}

	return (
		<div className={cn("mt-2 space-y-2", className)}>
			{youtubeUrls.map((youtubeUrl) => (
				<YouTubeEmbedPlayer
					key={youtubeUrl}
					url={youtubeUrl}
					className={playerClassName}
				/>
			))}
		</div>
	);
}
