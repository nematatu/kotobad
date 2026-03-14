"use client";

import { XIcon } from "lucide-react";
import {
	MorphingDialog,
	MorphingDialogClose,
	MorphingDialogContainer,
	MorphingDialogContent,
	MorphingDialogImage,
	MorphingDialogTrigger,
} from "@/components/ui/morphing-dialog";
import { cn } from "@/lib/utils";
import { toCfImageUrl } from "@/lib/utils/cfImage";

const MODAL_IMAGE_WIDTH = 2200;
const MODAL_IMAGE_QUALITY = 88;

const DIALOG_TRANSITION = {
	duration: 0.24,
	ease: "easeInOut",
} as const;

type ImageSource = string | null | undefined;

type ThreadPostImageProps = {
	imageUrl: ImageSource;
	alt?: string;
	width: number;
	quality?: number;
	containerClassName?: string;
	imageClassName?: string;
	loading?: "lazy" | "eager";
	enableZoom?: boolean;
};

export const ThreadPostImage = ({
	imageUrl,
	alt = "",
	width,
	quality = 82,
	containerClassName,
	imageClassName,
	loading = "lazy",
	enableZoom = false,
}: ThreadPostImageProps) => {
	const transformedUrl = toCfImageUrl(imageUrl, { width, quality });
	const expandedImageUrl =
		toCfImageUrl(imageUrl, {
			width: MODAL_IMAGE_WIDTH,
			quality: MODAL_IMAGE_QUALITY,
		}) ?? transformedUrl;

	if (!transformedUrl) {
		return null;
	}

	if (!enableZoom) {
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
					className={cn("h-full w-full object-cover", imageClassName)}
				/>
			</div>
		);
	}

	return (
		<MorphingDialog transition={DIALOG_TRANSITION}>
			<MorphingDialogTrigger
				className={cn(
					"overflow-hidden rounded-xl border border-slate-200 bg-slate-50 [@media(hover:hover)]:cursor-zoom-in",
					containerClassName,
				)}
			>
				<MorphingDialogImage
					src={transformedUrl}
					alt={alt}
					className={cn("h-full w-full object-cover", imageClassName)}
				/>
			</MorphingDialogTrigger>
			<MorphingDialogContainer>
				<div className="relative flex h-full w-full items-center justify-center p-3 sm:p-6">
					<MorphingDialogContent className="relative">
						<div className="relative h-auto w-full max-w-[90vw] lg:h-[90vh]">
							<MorphingDialogImage
								src={expandedImageUrl}
								alt={alt}
								className="h-auto w-full max-w-[90vw] rounded-[4px] object-contain lg:h-[90vh] [@media(hover:hover)]:cursor-zoom-out"
							/>
							<MorphingDialogClose className="absolute inset-0 h-full w-full rounded-none bg-transparent p-0 shadow-none" />
						</div>
					</MorphingDialogContent>
					<MorphingDialogClose
						className="fixed right-4 top-[calc(env(safe-area-inset-top)+0.75rem)] h-9 w-9 rounded-full bg-white/90 p-2 text-zinc-600 shadow-md backdrop-blur [@media(hover:hover)]:hover:bg-white dark:bg-slate-900/90 dark:text-slate-200 dark:[@media(hover:hover)]:hover:bg-slate-900"
						variants={{
							initial: { opacity: 0 },
							animate: {
								opacity: 1,
								transition: {
									delay: DIALOG_TRANSITION.duration,
									duration: 0.08,
								},
							},
							exit: { opacity: 0, transition: { duration: 0 } },
						}}
					>
						<XIcon className="h-5 w-5" />
					</MorphingDialogClose>
				</div>
			</MorphingDialogContainer>
		</MorphingDialog>
	);
};
