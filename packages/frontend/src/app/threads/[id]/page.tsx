import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ActionLink from "@/components/common/button/ActionLink";
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
			<ActionLink
				item={{
					icon: ArrowLeft,
					label: "スレッド一覧へ",
					href: "/threads",
				}}
			/>
			<ThreadDetailHeader threadId={threadId} />
			<ThreadPostsStream threadId={threadId} />
		</div>
	);
}
