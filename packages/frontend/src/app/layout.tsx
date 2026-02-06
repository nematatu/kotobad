export { metadata } from "@/lib/config/metadata/metadata";
import "./globals.css";
import type { TagType } from "@kotobad/shared/src/types/tag";
import { Toaster } from "sonner";
import { getTags } from "@/app/threads/lib/getTags";
import Footer from "@/components/feature/footer/Footer";
import Header from "@/components/feature/header/header";
import MobileBottomNav from "@/components/feature/navigation/MobileBottomNav";
import { UserProvider } from "@/components/feature/provider/UserProvider";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tags: TagType[] = await getTags();

	return (
		<html lang="ja">
			<body className="min-h-screen bg-surface-100">
				<UserProvider>
					<div className="min-h-screen flex flex-col">
						<Toaster richColors />
						<Header tags={tags} />
						<main className="flex-1 min-h-screen bg-surface-100 pb-16 mb-8 [@media(min-width:496px)]:pb-0">
							{children}
						</main>
						<Footer />
						<MobileBottomNav tags={tags} />
					</div>
				</UserProvider>
			</body>
		</html>
	);
}
