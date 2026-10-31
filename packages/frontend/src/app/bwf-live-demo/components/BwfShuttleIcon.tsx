export function BwfShuttleIcon({
	className = "w-5 h-5",
}: {
	className?: string;
}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className={`inline-block text-rose-600 dark:text-rose-400 select-none ${className}`}
			role="img"
			aria-label="サーブ中"
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.7"
				transform="rotate(-42 12 12)"
			>
				<path d="M4 2h16l-4 13H8z" />
				<path d="m8 2 2 13M12 2v13m4-13-2 13" />
				<path fill="currentColor" d="M8 15h8l-1.2 4.1a3 3 0 0 1-5.6 0z" />
			</g>
		</svg>
	);
}
