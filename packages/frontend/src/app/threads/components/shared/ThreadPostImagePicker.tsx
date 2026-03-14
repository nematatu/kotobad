"use client";

import { ImagePlus, X } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThreadPostImagePickerProps = {
	imageInputRef: RefObject<HTMLInputElement | null>;
	imagePreviewUrls: string[];
	maxImages: number;
	onSelectImageAction: (event: ChangeEvent<HTMLInputElement>) => void;
	onOpenImageDialogAction: () => void;
	onClearImageAction: () => void;
	onRemoveImageAction: (index: number) => void;
	actionsClassName?: string;
	previewImageClassName?: string;
};

export const ThreadPostImagePicker = ({
	imageInputRef,
	imagePreviewUrls,
	maxImages,
	onSelectImageAction,
	onOpenImageDialogAction,
	onClearImageAction,
	onRemoveImageAction,
	actionsClassName,
	previewImageClassName,
}: ThreadPostImagePickerProps) => {
	const hasImage = imagePreviewUrls.length > 0;
	const canAddMore = imagePreviewUrls.length < maxImages;

	return (
		<>
			<input
				ref={imageInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/avif"
				multiple={maxImages > 1}
				onChange={onSelectImageAction}
				className="hidden"
			/>
			<div className={cn("flex items-center gap-2", actionsClassName)}>
				<Button
					type="button"
					variant="outline"
					rounded="full"
					className="h-8 px-3 text-xs"
					onClick={onOpenImageDialogAction}
					disabled={!canAddMore}
				>
					<ImagePlus className="h-4 w-4" />
					画像を追加 ({imagePreviewUrls.length}/{maxImages})
				</Button>
				{hasImage && (
					<Button
						type="button"
						variant="ghost"
						rounded="full"
						className="h-8 px-2 text-xs text-slate-600"
						onClick={onClearImageAction}
					>
						<X className="h-4 w-4" />
						全削除
					</Button>
				)}
			</div>
			{hasImage && (
				<div
					className={cn(
						"grid gap-2",
						imagePreviewUrls.length > 1 ? "grid-cols-2" : "grid-cols-1",
					)}
				>
					{imagePreviewUrls.map((imagePreviewUrl, index) => (
						<div
							key={imagePreviewUrl}
							className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
						>
							{/* biome-ignore lint/performance/noImgElement: blob preview image is rendered directly from File object URL. */}
							<img
								src={imagePreviewUrl}
								alt={`投稿予定の画像プレビュー ${index + 1}`}
								className={cn(
									"h-28 w-full object-cover",
									previewImageClassName,
								)}
							/>
							<button
								type="button"
								onClick={() => onRemoveImageAction(index)}
								className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white"
								aria-label={`画像${index + 1}を削除`}
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</div>
					))}
				</div>
			)}
		</>
	);
};
