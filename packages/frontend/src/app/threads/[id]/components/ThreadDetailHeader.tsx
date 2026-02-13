import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	const getLabelClass = (tagId: number) =>
		CategoryColorMap[tagId % CategoryColorMap.length];
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
