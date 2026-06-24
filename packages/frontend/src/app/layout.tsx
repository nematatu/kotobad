export { metadata, viewport } from "@/lib/config/metadata/metadata";

import "./globals.css";
import type { TagType } from "@kotobad/shared/src/types/tag";
import Image from "next/image";
import { getTags } from "@/app/threads/lib/getTags";
import PwaRegister from "@/components/common/PwaRegister";
import ConditionalFooter from "@/components/feature/footer/ConditionalFooter";
import Header from "@/components/feature/header/header";
import LayoutClientFeatures from "@/components/feature/layout/LayoutClientFeatures";
import { Providers } from "./providers";

const THEME_INIT_INLINE_SCRIPT =
	'(()=>{const k="kotobad-theme";try{const s=window.localStorage.getItem(k);const d=window.matchMedia("(prefers-color-scheme: dark)").matches;const t=s==="light"||s==="dark"?s:d?"dark":"light";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}catch{}})();';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tags: TagType[] = await getTags();

	return (
		<html lang="ja" suppressHydrationWarning>
			<head>
				<script>{THEME_INIT_INLINE_SCRIPT}</script>
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Kotobad" />
				<meta name="theme-color" content="#0f172a" />
				<link rel="apple-touch-icon" href="/pwa-192x192.png" />
				<link
					rel="apple-touch-startup-image"
					href="/startup/startup-1179x2556.png"
					media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/startup/startup-1290x2796.png"
					media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/startup/startup-1170x2532.png"
					media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/startup/startup-828x1792.png"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/startup/startup-1125x2436.png"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/startup/startup-1284x2778.png"
					media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
			</head>
			<body className="min-h-screen bg-[#F0F0F0] dark:bg-slate-900">
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
					<div className="relative flex min-h-screen flex-col pb-[calc(env(safe-area-inset-bottom)+5rem)] [@media(min-width:496px)]:pb-0">
						<div
							id="page-top-anchor"
							className="h-0 w-full"
							aria-hidden="true"
						/>
						<Header tags={tags} />
						<LayoutClientFeatures tags={tags} />
						<main className="view-transition-page-content flex-1 min-h-screen pb-16 mb-8 [@media(min-width:496px)]:pb-0">
							{children}
						</main>
						<ConditionalFooter />
					</div>
				</Providers>
			</body>
		</html>
	);
}
