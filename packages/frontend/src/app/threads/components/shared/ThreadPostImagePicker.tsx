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
	showIcons?: boolean;
	forceLightTheme?: boolean;
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
	showIcons = true,
	forceLightTheme = false,
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
					className={cn(
						"h-8 px-3 text-xs",
						forceLightTheme
							? "!border-[#d1d5db] !bg-[#ffffff] !text-[#334155] hover:!bg-[#f8fafc]"
							: undefined,
					)}
					onClick={onOpenImageDialogAction}
					disabled={!canAddMore}
				>
					{showIcons ? <ImagePlus className="h-4 w-4" /> : null}
					画像を追加 ({imagePreviewUrls.length}/{maxImages})
				</Button>
				{hasImage && (
					<Button
						type="button"
						variant="ghost"
						rounded="full"
						className={cn(
							"h-8 px-2 text-xs text-slate-600",
							forceLightTheme
								? "!text-[#475569] hover:!bg-[#f1f5f9]"
								: undefined,
						)}
						onClick={onClearImageAction}
					>
						{showIcons ? <X className="h-4 w-4" /> : null}
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
							className={cn(
								"relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50",
								forceLightTheme ? "!border-[#d1d5db] !bg-[#f8fafc]" : undefined,
							)}
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
								className={cn(
									"absolute right-1 top-1 inline-flex items-center justify-center rounded-full bg-black/55 text-white",
									showIcons ? "h-6 w-6" : "h-6 px-2 text-[10px] font-medium",
								)}
								aria-label={`画像${index + 1}を削除`}
							>
								{showIcons ? <X className="h-3.5 w-3.5" /> : "削除"}
							</button>
						</div>
					))}
				</div>
			)}
		</>
	);
};
