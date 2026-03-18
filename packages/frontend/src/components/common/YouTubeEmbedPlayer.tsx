"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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
	return (
		<div
			data-no-card-link={noCardLink ? "true" : undefined}
			className={cn(
				"overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900",
				className,
			)}
		>
			<div className="aspect-video w-full">
				<ReactPlayer src={url} controls width="100%" height="100%" />
			</div>
		</div>
	);
}
