import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import Header from "@/components/feature/header/header";
import { UserProvider } from "@/components/feature/provider/UserProvider";
import { verifyJwtServer } from "@/lib/token/jwt.server";

export const metadata: Metadata = {
	title: "kototbad",
	description: "badmitnon BBS",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const token = cookieStore.get("accessToken")?.value ?? null;

	let initialUser = null;
	const accessSecret = process.env.ACCESS_SECRET;

	if (token && accessSecret) {
		try {
			const payload = await verifyJwtServer(token, accessSecret);
			initialUser = { id: payload.id, username: payload.username };
		} catch (_e) {
			initialUser = null;
		}
	} else if (token) {
		console.warn("JWT_SECRET is not set; skipping token verification.");
		initialUser = null;
	}

	return (
		<html lang="ja">
			<body>
				<UserProvider initialUser={initialUser}>
					<Header />
					<main className="mt-6">{children}</main>
				</UserProvider>
			</body>
		</html>
	);
}
