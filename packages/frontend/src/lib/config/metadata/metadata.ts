import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
	themeColor: "#ffffff",
};

export const metadata: Metadata = {
	metadataBase: new URL("https://kotobad.com"),
	applicationName: "コトバド",
	description: "バドミントン掲示板",
	manifest: "/manifest.webmanifest",
	icons: {
		icon: [
			{
				url: "/pwa-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				url: "/pwa-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		apple: [
			{
				url: "/pwa-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
		],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "コトバド",
	},
	openGraph: {
		type: "website",
		title: "コトバド",
		description: "バドミントン掲示板",
		url: "https://kotobad.com",
		images: [
			{
				url: "/ogp/ogp.png",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		title: "コトバド",
		description: "バドミントン掲示板",
		images: ["/ogp/ogp.png"],
		card: "summary_large_image",
	},
};
