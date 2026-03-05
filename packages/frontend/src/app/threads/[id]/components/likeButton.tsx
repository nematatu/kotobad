"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

const ThreadHeartLottiePlayer = dynamic(
	() =>
		import("./ThreadHeartLottiePlayer").then(
			(module) => module.ThreadHeartLottiePlayer,
		),
	{ ssr: false },
);

type PlayerLike = {
	play: () => void;
	stop: () => void;
};

export function LikeButton() {
	const playerRef = useRef<PlayerLike | null>(null);
	const onReadyAction = useCallback((player: PlayerLike | null) => {
		playerRef.current = player;
	}, []);

	const onClick = () => {
		playerRef.current?.stop(); // 先頭に戻す
		playerRef.current?.play(); // 再生
	};

	return (
		<Button
			variant="ghost"
			enableClickAnimation
			onClick={onClick}
			className="inline-flex items-center"
		>
			<ThreadHeartLottiePlayer onReadyAction={onReadyAction} />
		</Button>
	);
}
