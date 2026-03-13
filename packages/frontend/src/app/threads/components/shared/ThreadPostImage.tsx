"use client";

import { cn } from "@/lib/utils";
import { toCfImageUrl } from "@/lib/utils/cfImage";

type ThreadPostImageProps = {
	imageUrl: string | null | undefined;
	alt?: string;
	width: number;
	quality?: number;
	containerClassName?: string;
	imageClassName?: string;
	loading?: "lazy" | "eager";
};

export const ThreadPostImage = ({
	imageUrl,
	alt = "",
	width,
	quality = 82,
	containerClassName,
	imageClassName,
	loading = "lazy",
}: ThreadPostImageProps) => {
	const transformedUrl = toCfImageUrl(imageUrl, { width, quality });
	if (!transformedUrl) {
		return null;
	}

	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl border border-slate-200 bg-slate-50",
				containerClassName,
			)}
		>
			{/* biome-ignore lint/performance/noImgElement: Cloudflare Image Transform URL is already optimized for delivery. */}
			<img
				src={transformedUrl}
				alt={alt}
				loading={loading}
				className={cn("w-full object-contain", imageClassName)}
			/>
		</div>
	);
};
