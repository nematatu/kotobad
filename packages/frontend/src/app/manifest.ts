import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "コトバド",
		short_name: "コトバド",
		description: "バドミントン掲示板",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#ffffff",
		icons: [
			{
				src: "/pwa-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/pwa-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
