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
import type { ThreadHeartLottieController } from "./ThreadHeartLottiePlayer";

const ThreadHeartLottiePlayer = dynamic(
	() =>
		import("./ThreadHeartLottiePlayer").then(
			(module) => module.ThreadHeartLottiePlayer,
		),
	{ ssr: false },
);

type Props = {
	threadId: number;
	initialLikeCount: number;
	initialLikedByMe: boolean;
};

export function LikeButton({
	threadId,
	initialLikeCount,
	initialLikedByMe,
}: Props) {
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

	return (
		<Button
			variant="outline"
			onClick={onLikeClick}
			aria-pressed={likedByMe}
			className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm"
		>
			<ThreadHeartLottiePlayer
				onReadyAction={onReadyAction}
				className="h-16 w-16 shrink-0"
			/>
			<span>いいね {likeCount}</span>
		</Button>
	);
}
