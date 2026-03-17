"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AuthRequiredModal = dynamic(
	() => import("@/components/feature/auth/AuthRequiredModal"),
	{
		ssr: false,
	},
);

const MobileBottomNav = dynamic(
	() => import("@/components/feature/navigation/MobileBottomNav"),
	{
		ssr: false,
	},
);

const Toaster = dynamic(
	() => import("@/components/ui/sonner").then((mod) => mod.Toaster),
	{
		ssr: false,
	},
);

type Props = {
	tags: TagType[];
};

export default function LayoutClientFeatures({ tags }: Props) {
	const [isMobileViewport, setIsMobileViewport] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 495px)");
		const update = () => {
			setIsMobileViewport(mediaQuery.matches);
		};

		update();
		mediaQuery.addEventListener("change", update);

		return () => {
			mediaQuery.removeEventListener("change", update);
		};
	}, []);

	return (
		<>
			<Toaster richColors />
			<AuthRequiredModal />
			{isMobileViewport ? <MobileBottomNav tags={tags} /> : null}
		</>
	);
}
