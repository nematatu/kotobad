import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { TagList } from "../../components/view/tag/tagList";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div>
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col w-full items-center p-4 sm:py-7">
					<div className="text-xl sm:text-3xl font-bold break-words">
						{threadHeaderData.title}
					</div>
					<div className="mt-2 flex flex-wrap justify-center gap-2">
						<TagList tags={threadHeaderData.threadTags} />
					</div>
					<p className="text-gray-400">
						{formatDate(threadHeaderData.createdAt, { withTime: false })}
					</p>
				</div>
			</div>
		</div>
	);
};
