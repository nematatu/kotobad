import type { Metadata } from "next";
import "./globals.css";
import type { TagType } from "@kotobad/shared/src/types/tag";
import { Toaster } from "sonner";
import { getTags } from "@/app/threads/lib/getTags";
import Header from "@/components/feature/header/header";
import NavigationTransition from "@/components/feature/navigation/NavigationTransition";
import { UserProvider } from "@/components/feature/provider/UserProvider";

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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tags: TagType[] = await getTags();

	return (
		<html lang="ja">
			<body>
				<UserProvider>
					<Toaster richColors />
					<Header tags={tags} />
					<NavigationTransition />
					<main>{children}</main>
				</UserProvider>
			</body>
		</html>
	);
}
