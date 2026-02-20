import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { TagList } from "../../components/view/tag/tagList";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div className="flex flex-col items-center justify-center gap-2 py-3">
			<p className="text-gray-400 text-xs sm:text-sm">
				{formatDate(threadHeaderData.createdAt, { withTime: false })}
			</p>
			<div className="flex items-center space-x-2 text-lg sm:text-2xl font-bold break-words">
				<span>{threadHeaderData.title}</span>
				<div className="text-gray-400 text-xs sm:text-sm flex space-x-1">
					<span>by</span>
					<AuthorAvatar
						name={threadHeaderData.author.name}
						image={threadHeaderData.author.image}
						className="h-4 w-4 md:h-5 md:w-5 mr-1"
					/>
					{threadHeaderData.author.name}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<TagList tags={threadHeaderData.threadTags} />
			</div>
		</div>
	);
};
