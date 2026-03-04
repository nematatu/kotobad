"use client";

import {
	SetThreadLikesResponseSchema,
	SetThreadLikesSchema,
} from "@kotobad/shared/src/schemas/thread";
import { Heart } from "lucide-react";
import { useState } from "react";
import IconButton from "@/components/common/button/IconButton";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

type Props = {
	threadId: number;
	initialLikeCount: number;
	initialLikedByMe: boolean;
};

export const ThreadLikeButton = ({
	threadId,
	initialLikeCount,
	initialLikedByMe,
}: Props) => {
	const [likeCount, setLikeCount] = useState(initialLikeCount);
	const [likedByMe, setLikedByMe] = useState(initialLikedByMe);
	const [isUpdating, setIsUpdating] = useState(false);

	const onLikeClick = async () => {
		if (isUpdating) {
			return;
		}

		const nextLiked = !likedByMe;
		const previousLiked = likedByMe;
		const previousLikeCount = likeCount;

		setLikedByMe(nextLiked);
		setLikeCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
		setIsUpdating(true);

		try {
			const endpoint = await getBffApiUrl("SET_THREAD_LIKES");
			const requestBody = SetThreadLikesSchema.parse({
				threadId,
				active: nextLiked,
			});

			const raw = await BffFetcher<unknown>(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const response = SetThreadLikesResponseSchema.parse(raw);
			setLikeCount(response.likeCount);
			setLikedByMe(response.likedByMe);
		} catch (error: unknown) {
			setLikedByMe(previousLiked);
			setLikeCount(previousLikeCount);

			const fetchError = error as BffFetcherError;
			if (fetchError.status !== 401) {
				console.error("Failed to set thread like", error);
			}
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="">
			<IconButton
				size="lg"
				variant={"google"}
				enableClickAnimation
				icon={<Heart className={likedByMe ? "fill-red-500" : ""} />}
				type="button"
				onClick={onLikeClick}
				aria-pressed={likedByMe}
				className={`items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer`}
			>
				<span>いいね {likeCount}</span>
			</IconButton>
		</div>
	);
};
