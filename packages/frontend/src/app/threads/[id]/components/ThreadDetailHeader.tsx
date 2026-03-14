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
	const threadImageUrls = threadHeaderData.imageUrls.slice(0, 2);

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
			{threadImageUrls.length > 0 && (
				<div
					className={
						threadImageUrls.length > 1
							? "grid max-w-[28rem] grid-cols-2 gap-2"
							: "max-w-[20rem]"
					}
				>
					{threadImageUrls.map((imageUrl) => (
						<ThreadPostImage
							key={imageUrl}
							imageUrl={imageUrl}
							width={960}
							quality={80}
							containerClassName="h-44 rounded-xl"
							imageClassName="h-full"
						/>
					))}
				</div>
			)}
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
