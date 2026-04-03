"use client";

import type { FavoritePlayerType } from "@kotobad/shared/src/types/user";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toPresetCfImageUrl } from "@/lib/utils/cfImage";

type FavoritePlayerImageCardProps = {
	player: FavoritePlayerType;
	onRemoveAction?: (playerId: number) => void;
	className?: string;
};

export function FavoritePlayerImageCard({
	player,
	onRemoveAction,
	className,
}: FavoritePlayerImageCardProps) {
	return (
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
			{player.imageUrl ? (
				<Image
					src={
						toPresetCfImageUrl(player.imageUrl, "playerThumb") ??
						player.imageUrl
					}
					alt={player.name}
					width={64}
					height={64}
					unoptimized
					className="h-20 w-20 rounded-md object-cover"
				/>
			) : (
				<div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500">
					No Image
				</div>
			)}
			<span className="text-xs leading-tight text-slate-700 font-semibold">
				{player.name}
			</span>
		</div>
	);
}
