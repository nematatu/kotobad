import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
import { YouTubeEmbedsFromText } from "@/components/common/YouTubeEmbedsFromText";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { ThreadPostImage } from "../../components/shared/ThreadPostImage";
import { TagList } from "../../components/view/tag/tagList";
import { LikeButton } from "./likeButton";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	const threadImageUrls = (threadHeaderData.imageUrls ?? []).slice(0, 2);

	return (
		<div className="px-2 sm:px-0 flex flex-col justify-center space-y-4 mt-8 mb-4 sm:mb-9">
			<p className="block sm:hidden text-gray-400 text-xs sm:text-sm">
				{formatDate(threadHeaderData.createdAt, {
					withTime: false,
				})}
			</p>
			<div className="max-w-4xl space-y-2">
				<h1 className="text-left text-lg sm:text-2xl font-bold break-words">
					<AutoLinkText text={threadHeaderData.title} hideYouTubeUrls />
				</h1>
				<YouTubeEmbedsFromText
					text={threadHeaderData.title}
					playerClassName="max-w-[22rem]"
				/>
			</div>
			<Link
				href={`/users/${encodeURIComponent(threadHeaderData.authorId)}`}
				showIndicator={false}
				className="inline-flex w-fit items-center gap-2 text-xs text-slate-500 sm:hidden"
			>
				by
				<div className="flex items-center gap-1">
					<AuthorAvatar
						name={threadHeaderData.author.name}
						image={threadHeaderData.author.image}
						className="h-5 w-5 bg-white"
						fallbackClassName="text-[10px]"
					/>
					{threadHeaderData.author.name}
				</div>
			</Link>
			{threadImageUrls.length > 0 && (
				<div
					className={
						threadImageUrls.length > 1
							? "grid max-w-[20rem] grid-cols-2 gap-2"
							: "max-w-[12rem]"
					}
				>
					{threadImageUrls.map((imageUrl) => (
						<ThreadPostImage
							key={imageUrl}
							imageUrl={imageUrl}
							containerClassName="w-[9rem] rounded-lg"
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
