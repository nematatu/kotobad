"use client";

import type { FavoritePlayerType } from "@kotobad/shared/src/types/user";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toPresetCfImageUrl } from "@/lib/utils/cfImage";

type FavoritePlayerImageCardProps = {
	player: FavoritePlayerType;
	onRemoveAction?: (playerId: number) => void;
	className?: string;
	enablePreview?: boolean;
};

export function FavoritePlayerImageCard({
	player,
	onRemoveAction,
	className,
	enablePreview = false,
}: FavoritePlayerImageCardProps) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const cardImageUrl =
		toPresetCfImageUrl(player.imageUrl, "playerThumb") ?? player.imageUrl;
	const previewImageUrl =
		toPresetCfImageUrl(player.imageUrl, "playerZoom") ?? player.imageUrl;

	return (
		<>
			<div
				className={cn(
					"relative flex w-[5.25rem] flex-col items-center gap-2 text-left",
					className,
				)}
			>
				{onRemoveAction ? (
					<Button
						variant="outline"
						size="icon"
						rounded="full"
						enableClickAnimation
						aria-label={`${player.name} を選択解除`}
						onClick={() => onRemoveAction(player.id)}
						className="absolute -top-2 right-0 z-10 h-6 w-6 border-2 border-slate-200 bg-red-500 p-0 text-white shadow-none [@media(hover:hover)]:hover:bg-red-400"
					>
						<X strokeWidth="4" className="h-3.5 w-3.5 text-white" />
					</Button>
				) : null}
				{cardImageUrl ? (
					enablePreview ? (
						<button
							type="button"
							aria-label={`${player.name} の画像を拡大表示`}
							className="cursor-zoom-in"
							onClick={() => setIsPreviewOpen(true)}
						>
							<Image
								src={cardImageUrl}
								alt={player.name}
								width={80}
								height={80}
								unoptimized
								className="h-20 w-20 rounded-md object-cover"
							/>
						</button>
					) : (
						<Image
							src={cardImageUrl}
							alt={player.name}
							width={80}
							height={80}
							unoptimized
							className="h-20 w-20 rounded-md object-cover"
						/>
					)
				) : (
					<div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500">
						No Image
					</div>
				)}
				<span className="text-xs leading-tight text-slate-700 font-semibold">
					{player.name}
				</span>
			</div>
			{enablePreview && previewImageUrl ? (
				<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
					<DialogContent
						className="w-[calc(100vw-0.375rem)] max-w-[min(92vw,720px)] rounded-md border-[#d6dde6] bg-white p-0"
						closeButtonClassName="right-3 top-3 z-40 h-8 w-8 bg-white/95 text-[#304050] opacity-100 shadow-none"
					>
						<DialogHeader className="sr-only">
							<DialogTitle>{player.name} の画像プレビュー</DialogTitle>
						</DialogHeader>
						<div className="relative aspect-square w-full">
							<Image
								src={previewImageUrl}
								alt={player.name}
								fill
								unoptimized
								className="object-cover"
							/>
						</div>
					</DialogContent>
				</Dialog>
			) : null}
		</>
	);
}
