import { Suspense } from "react";
import { getPostByThreadId } from "@/app/threads/lib/getPostByThreadId";
import { ThreadDetailHeader } from "./components/ThreadDetailHeader";
import { ThreadPostsFallback } from "./components/ThreadPostsFallback";
import { ThreadPostsStream } from "./components/ThreadPostsStream";
export const revalidate = 900;
export const dynamic = "force-static";
export const dynamicParams = true; // ビルド時に静的生成せず、初回アクセスでISR生成

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const renderedparams = await params;
	const threadId = renderedparams.id;
	const postsPromise = getPostByThreadId(threadId);
	const threadIdNumber = Number(threadId);

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailHeader id={threadId} />
			<Suspense fallback={<ThreadPostsFallback />}>
				<ThreadPostsStream posts={postsPromise} threadId={threadIdNumber} />
			</Suspense>
		</div>
	);
}
