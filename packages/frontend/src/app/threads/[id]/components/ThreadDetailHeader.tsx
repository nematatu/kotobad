import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { TagList } from "../../components/view/tag/tagList";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div className="flex flex-col items-center gap-2 sm:gap-3 p-4">
			<h1 className="text-left text-lg sm:text-2xl font-bold break-words">
				{threadHeaderData.title}
			</h1>
			<div className="mt-4 flex flex-wrap justify-center gap-2">
				<TagList tags={threadHeaderData.threadTags} />
			</div>
			<p className="self-end text-gray-400 text-xs sm:text-sm">
				{formatDate(threadHeaderData.createdAt, { withTime: false })}
			</p>
		</div>
	);
};
