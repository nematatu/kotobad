import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { notFound } from "next/navigation";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";
import { getThreadById } from "../../lib/getThreadById";

type Props = {
	threadId: number;
};

export const ThreadDetailHeader = async ({ threadId }: Props) => {
	const getLabelClass = (tagId: number) =>
		CategoryColorMap[tagId % CategoryColorMap.length];

	let threadHeaderData: ThreadType;
	const threadIdString = threadId.toString();

	try {
		threadHeaderData = await getThreadById(threadIdString);
	} catch (e) {
		const err = e as { status?: number };
		if (err.status === 404) {
			return notFound();
		}
		throw e;
	}
	return (
		<div>
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col w-full items-center p-4 sm:py-7">
					<div className="text-xl sm:text-3xl font-bold break-words">
						{threadHeaderData.title}
					</div>
					<div className="mt-2 flex flex-wrap justify-center gap-2">
						{threadHeaderData.threadTags?.map((tag) => (
							<span
								key={tag.tagId}
								className={cn(
									"rounded-full px-2 py-0.5 text-xs font-medium text-gray-800",
									getLabelClass(tag.tagId),
								)}
							>
								{tag.tags.name}
							</span>
						))}
					</div>
					<p className="text-gray-400">
						{formatDate(threadHeaderData.createdAt, { withTime: false })}
					</p>
				</div>
			</div>
		</div>
	);
};
