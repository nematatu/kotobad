import { notFound } from "next/navigation";
import { getAllThreads } from "@/lib/api/threads";
import { ThreadType } from "@b3s/shared/src/types";
import { getRelativeDate } from "@/utils/date/getRelativeDate";

type Props = {
	params: { id: string };
};

export default async function ThreadDetailPage({ params }: Props) {
	const res = await getAllThreads();
	try {
		if ("error" in res) {
			throw new Error(res.error);
		}
	} catch (e: any) {
		return <div>{e.message}</div>;
	}
	const threads: ThreadType.ThreadType[] = res.threads;

	const targetThread = threads.find(
		(t: ThreadType.ThreadType) => t.id === Number(params.id),
	);

	if (!targetThread) {
		return notFound();
	}

	return (
		<div className="p-6">
			<div className="flex items-center pb-6 space-x-3">
				<div className="text-2xl sm:text-3xl font-bold">
					{targetThread.title}
				</div>
				<p className="text-gray-400">
					{getRelativeDate(targetThread.createdAt)}
				</p>
			</div>
			<p className="text-gray-700">thread's contents</p>
		</div>
	);
}
