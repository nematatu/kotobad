"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useRef } from "react";
import animationData from "@/assets/lottie/test-like2.json";

type PlayerLike = {
	play: () => void;
	stop: () => void;
};

type Props = {
	onReadyAction?: (player: PlayerLike | null) => void;
};

export function ThreadHeartLottiePlayer({ onReadyAction }: Props) {
	const playerRef = useRef<Player>(null);

	useEffect(() => {
		onReadyAction?.(playerRef.current);
		return () => onReadyAction?.(null);
	}, [onReadyAction]);

	return (
		<Player
			ref={playerRef}
			src={animationData}
			autoplay={false}
			loop={false}
			keepLastFrame
		/>
	);
}
