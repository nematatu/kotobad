"use client";

import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toCfImageUrl } from "@/lib/utils/cfImage";

type ImageSource = string | null | undefined;

type ThreadPostImageProps = {
	imageUrl: ImageSource;
	alt?: string;
	containerClassName?: string;
	imageClassName?: string;
	loading?: "lazy" | "eager";
	enableZoom?: boolean;
};

export const ThreadPostImage = ({
	imageUrl,
	alt = "",
	containerClassName,
	imageClassName,
	loading = "lazy",
	enableZoom = false,
}: ThreadPostImageProps) => {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const zoomImageRef = useRef<HTMLImageElement | null>(null);
	const [isZoomImageReady, setIsZoomImageReady] = useState(false);
	const transformedUrl = toCfImageUrl(imageUrl);

	const openZoom = () => {
		const dialog = dialogRef.current;
		if (!dialog || dialog.open) {
			return;
		}

		setIsZoomImageReady(zoomImageRef.current?.complete ?? false);
		dialog.showModal();
	};

	const closeZoom = () => {
		const dialog = dialogRef.current;
		if (!dialog || !dialog.open) {
			return;
		}

		dialog.close();
	};

	if (!transformedUrl) {
		return null;
	}

	if (!enableZoom) {
		return (
			<div className={cn("overflow-hidden bg-slate-50", containerClassName)}>
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
		<>
			<button
				type="button"
				onClick={openZoom}
				aria-label={alt ? `${alt} を拡大表示` : "画像を拡大表示"}
				className={cn(
					"overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left [@media(hover:hover)]:cursor-zoom-in",
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
			</button>
			<dialog
				ref={dialogRef}
				onClose={() => setIsZoomImageReady(false)}
				className="m-0 h-dvh max-h-none w-screen max-w-none border-none bg-transparent p-0 outline-none [@media(hover:hover)]:m-auto [&::backdrop]:bg-black/95 [&::backdrop]:backdrop-blur-[1px]"
			>
				<div className="relative h-full w-full">
					<button
						type="button"
						onClick={closeZoom}
						aria-label="拡大画像を閉じる"
						className="absolute inset-0 h-full w-full"
					/>
					<div className="pointer-events-none relative flex h-full w-full items-center justify-center ">
						<div className="pointer-events-auto relative w-auto max-w-[min(92vw,1200px)] text-left">
							{/* biome-ignore lint/performance/noImgElement: Cloudflare Image Transform URL is already optimized for delivery. */}
							<img
								ref={zoomImageRef}
								src={transformedUrl}
								alt={alt}
								loading="eager"
								decoding="sync"
								fetchPriority="high"
								onLoad={() => setIsZoomImageReady(true)}
								onError={() => setIsZoomImageReady(true)}
								className={cn(
									"mx-auto h-auto w-auto max-h-[calc(100dvh-6rem)] max-w-full rounded-[4px] object-contain transition-opacity sm:max-h-[calc(100dvh-8rem)] [@media(hover:hover)]:cursor-zoom-out",
									isZoomImageReady ? "opacity-100" : "opacity-0",
								)}
								style={{ transitionDuration: "100ms" }}
							/>
							{!isZoomImageReady && (
								<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
									<div className="h-7 w-7 animate-spin rounded-full border-2 border-white/45 border-t-white/95" />
								</div>
							)}
							<button
								type="button"
								onClick={closeZoom}
								aria-label="拡大画像を閉じる"
								className="absolute inset-0 hidden [@media(hover:hover)]:block [@media(hover:hover)]:cursor-zoom-out"
							/>
						</div>
						<button
							type="button"
							onClick={closeZoom}
							aria-label="拡大画像を閉じる"
							className="pointer-events-auto fixed right-4 top-[calc(env(safe-area-inset-top)+0.75rem)] h-9 w-9 rounded-full bg-white/90 p-2 text-zinc-600 shadow-md backdrop-blur [@media(hover:hover)]:hover:bg-white dark:bg-slate-900/90 dark:text-slate-200 dark:[@media(hover:hover)]:hover:bg-slate-900 cursor-pointer"
						>
							<XIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			</dialog>
		</>
	);
};
