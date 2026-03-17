import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import {
	CF_IMAGE_PRESET_OPTIONS,
	toCfImageUrl,
	toPresetCfImageUrl,
} from "@/lib/utils/cfImage";

type Props = {
	threads: ThreadType[];
};

const previewWidths = [160, 220, 320];

const getPreviewSrcSet = (imageUrl: string | undefined) => {
	if (!imageUrl) {
		return undefined;
	}

	const srcSet = previewWidths
		.map((width) => {
			const transformed = toCfImageUrl(imageUrl, {
				...CF_IMAGE_PRESET_OPTIONS.threadList,
				width,
			});
			return transformed ? `${transformed} ${width}w` : null;
		})
		.filter((value): value is string => value !== null)
		.join(", ");

	return srcSet.length > 0 ? srcSet : undefined;
};

const getFallbackCharacter = (name: string | null | undefined) => {
	return name?.trim().charAt(0).toUpperCase() ?? "?";
};

export default function TrendingThreadList({ threads }: Props) {
	return (
		<div className="divide-y divide-slate-200">
			{threads.map((thread, index) => {
				const href = `/threads/${thread.id}`;
				const previewImageUrl =
					toPresetCfImageUrl(thread.imageUrls?.[0], "threadList") ?? undefined;
				const previewSrcSet = getPreviewSrcSet(thread.imageUrls?.[0]);
				const authorImage =
					toPresetCfImageUrl(thread.author.image, "avatar") ?? undefined;
				const authorInitial = getFallbackCharacter(thread.author.name);

				return (
					<a
						key={thread.id}
						href={href}
						className="block space-y-2 px-4 py-3 transition-colors [@media(hover:hover)]:hover:bg-slate-50"
						aria-label={`スレッドへ移動: ${thread.title}`}
					>
						<div className="flex items-center gap-2 text-xs text-slate-500">
							<span className="relative inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
								{authorImage ? (
									// biome-ignore lint/performance/noImgElement: Server-rendered avatar uses transformed URL and fixed display size.
									<img
										src={authorImage}
										alt=""
										className="h-full w-full object-cover"
										loading="lazy"
									/>
								) : (
									<span className="inline-flex h-full w-full items-center justify-center bg-gray-400 text-[10px] font-bold text-white">
										{authorInitial}
									</span>
								)}
							</span>
							<span>{thread.author.name}</span>
							<span>{getRelativeDate(thread.createdAt)}</span>
						</div>

						<h3 className="line-clamp-2 text-sm font-bold text-slate-800 sm:text-base">
							{thread.title}
						</h3>

						{previewImageUrl ? (
							<div className="max-w-[12rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
								{/* biome-ignore lint/performance/noImgElement: Cloudflare transformed image and responsive srcset are already optimized. */}
								<img
									src={previewImageUrl}
									alt=""
									loading={index === 0 ? "eager" : "lazy"}
									fetchPriority={index === 0 ? "high" : undefined}
									srcSet={previewSrcSet}
									sizes="(max-width: 640px) 110px, 130px"
									className="h-auto max-h-[15rem] w-full object-cover"
								/>
							</div>
						) : null}

						<div className="text-xs text-slate-500">
							コメント {thread.postCount.toLocaleString()}
						</div>
					</a>
				);
			})}
		</div>
	);
}
