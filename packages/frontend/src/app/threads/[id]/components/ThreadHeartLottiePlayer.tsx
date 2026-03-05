"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useCallback, useEffect, useMemo, useRef } from "react";
import animationData from "@/assets/lottie/test-like2.json";
import { cn } from "@/lib/utils";

export type ThreadHeartLottieController = {
	playLike: () => void;
	showLiked: () => void;
	showUnliked: () => void;
};

type Props = {
	onReadyAction?: (controller: ThreadHeartLottieController | null) => void;
	className?: string;
};

export function ThreadHeartLottiePlayer({ onReadyAction, className }: Props) {
	const playerRef = useRef<Player>(null);
	const controllerRef = useRef<ThreadHeartLottieController | null>(null);
	const hasNotifiedReadyRef = useRef(false);
	const lastFrame = useMemo(() => {
		const op = animationData.op;
		return Number.isFinite(op) ? Math.max(0, Math.floor(op) - 1) : 0;
	}, []);

	const runAction = useCallback(
		(action: "play" | "liked" | "unliked") => {
			const player = playerRef.current;
			if (!player) {
				return;
			}

			switch (action) {
				case "play":
					player.stop();
					player.play();
					break;
				case "liked":
					player.setSeeker(lastFrame, false);
					break;
				case "unliked":
					player.setSeeker(0, false);
					break;
			}
		},
		[lastFrame],
	);

	useEffect(() => {
		hasNotifiedReadyRef.current = false;
		const controller: ThreadHeartLottieController = {
			playLike: () => {
				runAction("play");
			},
			showLiked: () => {
				runAction("liked");
			},
			showUnliked: () => {
				runAction("unliked");
			},
		};
		controllerRef.current = controller;
		return () => {
			hasNotifiedReadyRef.current = false;
			controllerRef.current = null;
			onReadyAction?.(null);
		};
	}, [onReadyAction, runAction]);

	return (
		<Player
			ref={playerRef}
			src={animationData}
			autoplay={false}
			loop={false}
			speed={1.9}
			keepLastFrame
			className={cn(
				"[&_svg]:!h-full [&_svg]:!w-full [&_svg]:max-w-none",
				className,
			)}
			style={{ width: "100%", height: "100%" }}
			onEvent={(event) => {
				if (
					(event === "instanceSaved" || event === "ready") &&
					!hasNotifiedReadyRef.current &&
					controllerRef.current
				) {
					hasNotifiedReadyRef.current = true;
					onReadyAction?.(controllerRef.current);
				}
			}}
		/>
	);
}
