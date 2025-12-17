import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import Header from "@/components/feature/header/header";
import { UserProvider } from "@/components/feature/provider/UserProvider";
import {
	BetterAuthSessionResponseSchema,
	type BetterAuthUser,
} from "@/lib/auth/betterAuthSession";
import { getApiUrl } from "@/lib/config/apiUrls";

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

async function resolveInitialUser(): Promise<BetterAuthUser | null> {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();
	if (!cookieHeader) {
		return null;
	}

	try {
		const url = await getApiUrl("ME");
		const response = await fetch(url, {
			method: "GET",
			headers: { cookie: cookieHeader },
			credentials: "include",
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		const session = BetterAuthSessionResponseSchema.parse(data);
		return session.user;
	} catch (_error) {
		return null;
	}
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialUser = await resolveInitialUser();

	return (
		<html lang="ja">
			<body className="bg-surface-50">
				<UserProvider initialUser={initialUser}>
					<Header />
					<main className="mt-6">{children}</main>
				</UserProvider>
			</body>
		</html>
	);
}
