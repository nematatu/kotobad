import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { ThreadPostImage } from "../../components/shared/ThreadPostImage";
import { TagList } from "../../components/view/tag/tagList";
import { LikeButton } from "./likeButton";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div className="px-2 sm:px-0 flex flex-col justify-center space-y-4 mt-8 mb-4 sm:mb-9">
			<p className="block sm:hidden text-gray-400 text-xs sm:text-sm">
				{formatDate(threadHeaderData.createdAt, {
					withTime: false,
				})}
			</p>
			<h1 className="max-w-4xl text-left text-lg sm:text-2xl font-bold break-words">
				<AutoLinkText text={threadHeaderData.title} />
			</h1>
			<ThreadPostImage
				imageUrl={threadHeaderData.imageUrl}
				width={1280}
				quality={80}
				containerClassName="max-w-4xl rounded-2xl"
				imageClassName="max-h-[32rem]"
			/>
			{threadHeaderData.threadTags.length > 0 && (
				<div className="block sm:hidden flex flex-wrap gap-2">
					<TagList tags={threadHeaderData.threadTags} />
				</div>
			)}
			<div className="block">
				<LikeButton
					threadId={threadHeaderData.id}
					initialLikeCount={threadHeaderData.likeCount}
					initialLikedByMe={threadHeaderData.likedByMe}
				/>
			</div>
		</div>
	);
};
