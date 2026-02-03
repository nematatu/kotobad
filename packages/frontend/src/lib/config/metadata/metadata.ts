import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://kotobad.com"),
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
