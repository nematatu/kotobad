import { useEffect, useRef } from "react";
import { BwfShuttleIcon } from "./BwfShuttleIcon";

export function BwfScoreSide({
	sideIndex,
	score,
	serving,
	changed,
}: {
	sideIndex: 1 | 2;
	score: number | undefined;
	serving: boolean;
	changed: boolean;
}) {
	const scoreRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!changed || !scoreRef.current) return;
		scoreRef.current.animate(
			[{ transform: "scale(1.3)" }, { transform: "scale(1)" }],
			{ duration: 300, easing: "ease-out" },
		);
	}, [changed]);

	return (
		<div
			className={`flex min-w-0 items-center gap-1.5 ${
				sideIndex === 1 ? "justify-end" : "justify-start"
			}`}
		>
			{sideIndex === 1 && serving ? (
				<span className="animate-bounce inline-flex items-center">
					<BwfShuttleIcon className="h-5 w-5" />
				</span>
			) : null}
			<span
				ref={scoreRef}
				className="text-3xl font-black tracking-tight text-slate-900 tabular-nums dark:text-slate-50 sm:text-4xl"
			>
				{score ?? 0}
			</span>
			{sideIndex === 2 && serving ? (
				<span className="animate-bounce inline-flex items-center">
					<BwfShuttleIcon className="h-5 w-5" />
				</span>
			) : null}
		</div>
	);
}
