export { metadata } from "@/lib/config/metadata/metadata";
import "./globals.css";
import type { TagType } from "@kotobad/shared/src/types/tag";
import { Toaster } from "sonner";
import { getTags } from "@/app/threads/lib/getTags";
import Header from "@/components/feature/header/header";
import { UserProvider } from "@/components/feature/provider/UserProvider";

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
					<main className="bg-surface-100">{children}</main>
				</UserProvider>
			</body>
		</html>
	);
}
