import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { TagList } from "../../components/view/tag/tagList";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div>
			<div className="flex flex-col items-center justify-center gap-2">
				<p className="text-gray-400 text-sm">
					{formatDate(threadHeaderData.createdAt, { withTime: false })}
				</p>
				<div className="text-xl sm:text-2xl font-bold break-words">
					{threadHeaderData.title}
				</div>
				<div className="flex items-center gap-2">
					<TagList tags={threadHeaderData.threadTags} />
				</div>
			</div>
		</div>
	);
};
