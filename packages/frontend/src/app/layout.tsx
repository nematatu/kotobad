export { metadata, viewport } from "@/lib/config/metadata/metadata";
import "./globals.css";
import type { TagType } from "@kotobad/shared/src/types/tag";
import Image from "next/image";
import { getTags } from "@/app/threads/lib/getTags";
import PwaRegister from "@/components/common/PwaRegister";
import SplashGate from "@/components/common/SplashGate";
import AuthRequiredModal from "@/components/feature/auth/AuthRequiredModal";
import Footer from "@/components/feature/footer/Footer";
import Header from "@/components/feature/header/header";
import MobileBottomNav from "@/components/feature/navigation/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tags: TagType[] = await getTags();

	return (
		<html lang="ja" suppressHydrationWarning>
			<head>
				<script src="/theme-init.js" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Kotobad" />
				<meta name="theme-color" content="#0f172a" />
				<link rel="apple-touch-icon" href="/pwa-192x192.png" />
				<style nonce="pwa-splash">{`
					#initial-splash {
						background-color: #0f172a;
						position: fixed;
						inset: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 9999;
					}
				`}</style>
			</head>
			<body className="min-h-screen bg-[#F0F0F0] dark:bg-slate-900">
				<div
					id="initial-splash"
					className="initial-splash"
					aria-hidden="true"
					style={{ backgroundColor: "#0f172a" }}
				>
					<div className="initial-splash__art">
						<Image
							src="/assets/logo/logo.svg"
							alt="Kotobad logo symbol"
							className="initial-splash__logo initial-splash__logo--symbol"
							width={220}
							height={220}
							priority
						/>
						<Image
							src="/assets/logo/logo-moji.svg"
							alt=""
							className="initial-splash__logo initial-splash__logo--text"
							width={180}
							height={60}
							priority
						/>
					</div>
				</div>
				<div
					className="view-transition-static-background pointer-events-none fixed inset-0"
					style={{ zIndex: -1 }}
				>
					<Image
						src="/haikei/wave-haikei.svg"
						fill
						alt=""
						aria-hidden="true"
						sizes="100vw"
						className="object-cover opacity-50 dark:brightness-[0.45] dark:saturate-75"
					/>
				</div>

				<Providers>
					<PwaRegister />
					<SplashGate />
					<div className="relative flex min-h-screen flex-col pb-[calc(env(safe-area-inset-bottom)+5rem)] [@media(min-width:496px)]:pb-0">
						<div
							id="page-top-anchor"
							className="h-0 w-full"
							aria-hidden="true"
						/>
						<Toaster richColors />
						<Header tags={tags} />
						<AuthRequiredModal />
						<main className="view-transition-page-content flex-1 min-h-screen pb-16 mb-8 [@media(min-width:496px)]:pb-0">
							{children}
						</main>
						<Footer />
						<MobileBottomNav tags={tags} />
					</div>
				</Providers>
			</body>
		</html>
	);
}
