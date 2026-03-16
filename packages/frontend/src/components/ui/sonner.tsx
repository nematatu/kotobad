"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { resolvedTheme, theme = "system" } = useTheme();
	const activeTheme = theme === "system" ? (resolvedTheme ?? "light") : theme;
	const [position, setPosition] = useState<"top-center" | "bottom-right">(
		"top-center",
	);

	useEffect(() => {
		const handleResize = () => {
			setPosition(
				window.matchMedia("(min-width: 640px)").matches
					? "bottom-right"
					: "top-center",
			);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<Sonner
			theme={activeTheme as ToasterProps["theme"]}
			position={position}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
