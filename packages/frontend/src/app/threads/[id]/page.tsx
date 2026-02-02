// import { notFound } from "next/navigation";
// import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { ThreadDetailHeader } from "./components/ThreadDetailHeader";
export const revalidate = 900;
export const dynamic = "force-static";
export const dynamicParams = true; // ビルド時に静的生成せず、初回アクセスでISR生成

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const renderedparams = await params;
	const threadId = renderedparams.id;

	// try {
	// } catch (error: unknown) {
	// 	const fetchError = error as BffFetcherError;
	// 	if (fetchError.status === 404) {
	// 		return notFound();
	// 	}
	// 	throw error;
	// }

	return (
		<div className="p-1 sm:p-4">
			<div>
				<ThreadDetailHeader id={threadId} />
			</div>
		</div>
	);
}
