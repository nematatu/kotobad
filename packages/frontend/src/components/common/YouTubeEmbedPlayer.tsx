"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toYouTubeEmbedMeta } from "./youtubeUrlUtils";

type Props = {
	url: string;
	className?: string;
	noCardLink?: boolean;
};

export function YouTubeEmbedPlayer({
	url,
	className,
	noCardLink = false,
}: Props) {
	const [isActivated, setIsActivated] = useState(false);
	const embedMeta = toYouTubeEmbedMeta(url);
	if (!embedMeta) {
		return null;
	}

	const iframeUrl = new URL(embedMeta.embedUrl);
	if (isActivated) {
		iframeUrl.searchParams.set("autoplay", "1");
	}

	return (
		<div
			data-no-card-link={noCardLink ? "true" : undefined}
			className={cn(
				"group overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900",
				className,
			)}
		>
			<div className="relative aspect-video w-full bg-black leading-none">
				{isActivated ? (
					<iframe
						src={iframeUrl.toString()}
						title="YouTube video player"
						className="block h-full w-full border-0 align-top"
						loading="lazy"
						referrerPolicy="strict-origin-when-cross-origin"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
					/>
				) : (
					<button
						type="button"
						aria-label="YouTube を再生"
						onClick={() => setIsActivated(true)}
						className="relative block h-full w-full cursor-pointer"
					>
						{/* biome-ignore lint/performance/noImgElement: The thumbnail is loaded from YouTube CDN and used as a lightweight preview image. */}
						<img
							src={embedMeta.thumbnailUrl}
							alt=""
							loading="lazy"
							decoding="async"
							width={480}
							height={360}
							className="block h-full w-full object-cover"
						/>
						<span
							aria-hidden="true"
							className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20"
						/>
						<span className="absolute inset-0 flex items-center justify-center">
							<span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600/95 text-white shadow-lg transition-transform group-hover:scale-105">
								<Play className="h-6 w-6 fill-current pl-0.5" />
							</span>
						</span>
					</button>
				)}
			</div>
		</div>
	);
}
