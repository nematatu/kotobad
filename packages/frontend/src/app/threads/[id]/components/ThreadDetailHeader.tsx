import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { TagList } from "../../components/view/tag/tagList";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div className="space-y-4 mb-4">
			<div className="flex justify-center my-8 sm:my-13 ">
				<h1 className="max-w-4xl text-left text-lg sm:text-2xl font-bold break-words">
					{threadHeaderData.title}
				</h1>
			</div>
			{threadHeaderData.threadTags.length > 0 && (
				<div className="block sm:hidden flex flex-wrap gap-2">
					<TagList tags={threadHeaderData.threadTags} />
				</div>
			)}
			<p className="block sm:hidden text-gray-400 text-xs sm:text-sm">
				{formatDate(threadHeaderData.createdAt, {
					withTime: false,
				})}
			</p>
		</div>
	);
};
