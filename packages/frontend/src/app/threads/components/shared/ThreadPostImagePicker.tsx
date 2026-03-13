"use client";

import { ImagePlus, X } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThreadPostImagePickerProps = {
	imageInputRef: RefObject<HTMLInputElement | null>;
	imagePreviewUrl: string | null;
	hasImage: boolean;
	onSelectImageAction: (event: ChangeEvent<HTMLInputElement>) => void;
	onOpenImageDialogAction: () => void;
	onClearImageAction: () => void;
	actionsClassName?: string;
	previewImageClassName?: string;
};

export const ThreadPostImagePicker = ({
	imageInputRef,
	imagePreviewUrl,
	hasImage,
	onSelectImageAction,
	onOpenImageDialogAction,
	onClearImageAction,
	actionsClassName,
	previewImageClassName,
}: ThreadPostImagePickerProps) => {
	return (
		<>
			<input
				ref={imageInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/avif"
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
				>
					<ImagePlus className="h-4 w-4" />
					画像を追加
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
						削除
					</Button>
				)}
			</div>
			{imagePreviewUrl && (
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
					{/* biome-ignore lint/performance/noImgElement: blob preview image is rendered directly from File object URL. */}
					<img
						src={imagePreviewUrl}
						alt="投稿予定の画像プレビュー"
						className={cn(
							"max-h-72 w-full object-contain",
							previewImageClassName,
						)}
					/>
				</div>
			)}
		</>
	);
};
