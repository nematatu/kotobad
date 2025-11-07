import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/feature/darkMode/themeProvider";
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
		<html lang="ja" suppressHydrationWarning>
			<Head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
(function () {
  try {
    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch(e) {}
    if (theme && theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e){}
})();
          `,
					}}
				/>
			</Head>
			<body>
				<UserProvider initialUser={initialUser}>
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						enableSystem={false}
						disableTransitionOnChange
					>
						<Header />
						<main className="mt-6">{children}</main>
					</ThemeProvider>
				</UserProvider>
			</body>
		</html>
	);
}
