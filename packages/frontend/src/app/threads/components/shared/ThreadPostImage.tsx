"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { toCfImageUrl } from "@/lib/utils/cfImage";

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
	const [isOpen, setIsOpen] = useState(false);
	const [isZoomImageReady, setIsZoomImageReady] = useState(false);
	const transformedUrl = toCfImageUrl(imageUrl, { width, quality });
	const openZoom = () => {
		setIsZoomImageReady(false);
		setIsOpen(true);
	};
	const closeZoom = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		document.body.classList.add("overflow-hidden");
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.classList.remove("overflow-hidden");
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

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
			{isOpen &&
				createPortal(
					<div className="fixed inset-0 z-[200] bg-black/35 backdrop-blur-[1px]">
						<button
							type="button"
							onClick={closeZoom}
							aria-label="拡大画像を閉じる"
							className="absolute inset-0 h-full w-full"
						/>
						<div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center p-0 sm:p-6">
							<div className="pointer-events-auto relative h-auto w-full max-w-full text-left sm:max-w-[90vw] lg:h-[90vh]">
								{/* biome-ignore lint/performance/noImgElement: Cloudflare Image Transform URL is already optimized for delivery. */}
								<img
									src={transformedUrl}
									alt={alt}
									loading="eager"
									decoding="sync"
									fetchPriority="high"
									onLoad={() => setIsZoomImageReady(true)}
									onError={() => setIsZoomImageReady(true)}
									className={cn(
										"h-auto w-full max-w-full rounded-[4px] object-contain transition-opacity sm:max-w-[90vw] lg:h-[90vh] [@media(hover:hover)]:cursor-zoom-out",
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
									className="absolute inset-0 hidden [@media(hover:hover)]:block"
								/>
							</div>
							<button
								type="button"
								onClick={closeZoom}
								aria-label="拡大画像を閉じる"
								className={cn(
									"pointer-events-auto fixed right-4 top-[calc(env(safe-area-inset-top)+0.75rem)] h-9 w-9 rounded-full bg-white/90 p-2 text-zinc-600 shadow-md backdrop-blur [@media(hover:hover)]:hover:bg-white dark:bg-slate-900/90 dark:text-slate-200 dark:[@media(hover:hover)]:hover:bg-slate-900",
								)}
							>
								<XIcon className="h-5 w-5" />
							</button>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
};
