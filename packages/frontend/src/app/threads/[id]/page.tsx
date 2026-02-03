import { notFound } from "next/navigation";
import { ThreadDetailHeader } from "./components/ThreadDetailHeader";
import { ThreadPostsStream } from "./components/ThreadPostsStream";
export const dynamic = "force-dynamic";

export type Props = {
	params: Promise<{ id: string }>;
};

export default async function ThreadDetailPage({ params }: Props) {
	const renderedparams = await params;
	const threadId = Number(renderedparams.id);

	if (!Number.isFinite(threadId)) {
		return notFound();
	}

	return (
		<div className="p-1 sm:p-4">
			<ThreadDetailHeader threadId={threadId} />
			<ThreadPostsStream threadId={threadId} />
		</div>
	);
}
