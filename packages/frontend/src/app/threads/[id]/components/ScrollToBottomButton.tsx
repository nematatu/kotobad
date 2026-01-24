"use client";

import { useEffect, useState } from "react";
import BottomArrowIcon from "@/assets/threads/bottom_arrow.svg";

export default function ScrollToBottomButton() {
	const [showScrollButton, setShowScrollButton] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const scrolledToBottom =
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 20;
			setShowScrollButton(!scrolledToBottom);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`fixed sm:bottom-10 sm:right-10 bottom-3 right-3 transition-opacity duration-100 ${
				showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<button
				type="button"
				onClick={() =>
					window.scrollTo({
						top: document.body.scrollHeight,
						behavior: "smooth",
					})
				}
			>
				<BottomArrowIcon className="text-gray-600 w-20 h-20 p-4 cursor-pointer" />
			</button>
		</div>
	);
}
