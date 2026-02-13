export { metadata, viewport } from "@/lib/config/metadata/metadata";
import "./globals.css";
import type { TagType } from "@kotobad/shared/src/types/tag";
import Image from "next/image";
import { Toaster } from "sonner";
import { getTags } from "@/app/threads/lib/getTags";
import PwaRegister from "@/components/common/PwaRegister";
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
				<div
					className="pointer-events-none fixed inset-0"
					style={{ zIndex: -1 }}
				>
					<Image
						src="/haikei/wave-haikei.svg"
						fill
						alt=""
						aria-hidden="true"
						sizes="100vw"
						className="object-cover opacity-50"
					/>
				</div>

				<UserProvider>
					<PwaRegister />
					<div className="relative min-h-screen flex flex-col">
						<div
							id="page-top-anchor"
							className="h-0 w-full"
							aria-hidden="true"
						/>
						<Toaster richColors />
						<Header tags={tags} />
						<main className="flex-1 min-h-screen pb-16 mb-8 [@media(min-width:496px)]:pb-0">
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
