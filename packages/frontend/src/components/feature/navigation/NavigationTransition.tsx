"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function NavigationTransition() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const prevRef = useRef<string | null>(null);

	useEffect(() => {
		const query = searchParams?.toString() ?? "";
		const current = `${pathname}?${query}`;

		if (prevRef.current === null) {
			prevRef.current = current;
			return;
		}

		if (prevRef.current === current) return;
		prevRef.current = current;

		const root = document.body;
		root.classList.add("nav-transitioning");
		const timer = window.setTimeout(() => {
			root.classList.remove("nav-transitioning");
		}, 420);

		return () => window.clearTimeout(timer);
	}, [pathname, searchParams]);

	return (
		<div
			className="nav-progress pointer-events-none fixed inset-x-0 top-0 z-[60]"
			aria-hidden="true"
		/>
	);
}
