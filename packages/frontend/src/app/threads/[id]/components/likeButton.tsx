"use client";

import {
	SetThreadLikesResponseSchema,
	SetThreadLikesSchema,
} from "@kotobad/shared/src/schemas/thread";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { cn } from "@/lib/utils";
import type { ThreadHeartLottieController } from "./ThreadHeartLottiePlayer";

const ThreadHeartLottiePlayer = dynamic(
	() =>
		import("./ThreadHeartLottiePlayer").then(
			(module) => module.ThreadHeartLottiePlayer,
		),
	{ ssr: false },
);

export const THREAD_LIST_META_CHIP_CLASS =
	"thread-list-meta-chip box-border inline-flex h-[20px] flex-none items-center justify-center gap-[5px] rounded-sm px-2 py-0 align-middle text-gray-800 font-semibold leading-none pointer-events-auto";

type Props = {
	threadId: number;
	initialLikeCount: number;
	initialLikedByMe: boolean;
	size?: "default" | "compact";
};

export function LikeButton({
	threadId,
	initialLikeCount,
	initialLikedByMe,
	size = "default",
}: Props) {
	const compactHeartViewportSizePx = 31;
	const compactHeartPlayerSizePx = 61;
	const controllerRef = useRef<ThreadHeartLottieController | null>(null);
	const likedByMeRef = useRef(initialLikedByMe);
	const [likeCount, setLikeCount] = useState(initialLikeCount);
	const [likedByMe, setLikedByMe] = useState(initialLikedByMe);
	const [isUpdating, setIsUpdating] = useState(false);

	const onReadyAction = useCallback(
		(controller: ThreadHeartLottieController | null) => {
			controllerRef.current = controller;
			if (!controller) {
				return;
			}
			if (likedByMeRef.current) {
				controller.showLiked();
				return;
			}
			controller.showUnliked();
		},
		[],
	);

	const onLikeClick = async () => {
		if (isUpdating) {
			return;
		}

		const previousLikedByMe = likedByMe;
		const previousLikeCount = likeCount;
		const nextLikedByMe = !likedByMe;

		setIsUpdating(true);
		if (nextLikedByMe) {
			controllerRef.current?.playLike();
		} else {
			controllerRef.current?.showUnliked();
		}
		likedByMeRef.current = nextLikedByMe;
		setLikedByMe(nextLikedByMe);
		setLikeCount((current) => Math.max(0, current + (nextLikedByMe ? 1 : -1)));

		try {
			const endpoint = await getBffApiUrl("SET_THREAD_LIKES");
			const requestBody = SetThreadLikesSchema.parse({
				threadId,
				active: nextLikedByMe,
			});

			const raw = await BffFetcher<unknown>(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const response = SetThreadLikesResponseSchema.parse(raw);
			setLikeCount(response.likeCount);
			setLikedByMe(response.likedByMe);
			likedByMeRef.current = response.likedByMe;
			if (!response.likedByMe) {
				controllerRef.current?.showUnliked();
			}
		} catch (error: unknown) {
			setLikeCount(previousLikeCount);
			setLikedByMe(previousLikedByMe);
			likedByMeRef.current = previousLikedByMe;
			if (previousLikedByMe) {
				controllerRef.current?.showLiked();
			} else {
				controllerRef.current?.showUnliked();
			}

			const fetchError = error as BffFetcherError;
			if (fetchError.status !== 401) {
				console.error("Failed to set thread like", error);
			}
		} finally {
			setIsUpdating(false);
		}
	};

	const isCompact = size === "compact";
	const compactButtonClass = cn(
		THREAD_LIST_META_CHIP_CLASS,
		"group/like-button min-h-0 appearance-none overflow-visible border-0 text-[10px] shadow-none hover:text-gray-800 active:scale-95 cursor-pointer",
	);

	if (isCompact) {
		return (
			<button
				type="button"
				onClick={onLikeClick}
				aria-pressed={likedByMe}
				aria-label={likedByMe ? "いいねを解除" : "いいねする"}
				className={compactButtonClass}
			>
				<span
					className="relative inline-flex items-center justify-center overflow-visible shrink-0 transition-transform duration-100 [@media(hover:hover)]:group-hover/like-button:scale-110"
					style={{
						width: compactHeartViewportSizePx,
						height: compactHeartViewportSizePx,
					}}
				>
					<ThreadHeartLottiePlayer
						onReadyAction={onReadyAction}
						className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [&_*]:pointer-events-none [&_svg]:!h-full [&_svg]:!w-full"
						style={{
							width: compactHeartPlayerSizePx,
							height: compactHeartPlayerSizePx,
						}}
					/>
				</span>
				<span className="whitespace-nowrap text-[10px] font-semibold leading-none">
					{likeCount}
				</span>
			</button>
		);
	}

	return (
		<Button
			variant="outline"
			enableClickAnimation
			onClick={onLikeClick}
			aria-pressed={likedByMe}
			aria-label={likedByMe ? "いいねを解除" : "いいねする"}
			className="group/like-button inline-flex h-auto items-center gap-1.5 px-2 py-1 text-xs sm:text-sm"
		>
			<span className="relative inline-flex size-8 items-center justify-center shrink-0 transition-transform duration-100 sm:size-9 [@media(hover:hover)]:group-hover/like-button:scale-110">
				<ThreadHeartLottiePlayer
					onReadyAction={onReadyAction}
					className="pointer-events-none absolute inset-0 h-full w-full [&_*]:pointer-events-none [&_svg]:!h-full [&_svg]:!w-full [&_svg]:origin-center [&_svg]:scale-[2.1]"
				/>
			</span>
			<span className="whitespace-nowrap">{likeCount}</span>
		</Button>
	);
}
