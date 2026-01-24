import type { PostListType } from "@kotobad/shared/src/types/post";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";
import BreadCrumb from "./BreadCrumbs";
import { CreatePostForm } from "./CreatePostForm";
import { PostList } from "./PostList";
import ScrollToBottomButton from "./ScrollToBottomButton";

type Props = {
	thread: ThreadType;
	initialPosts: PostListType;
};

const sortByCreatedAt = (list: PostListType) =>
	[...list].sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);

export default function ThreadDetailClient({ thread, initialPosts }: Props) {
	const normalizedInitialPosts = Array.isArray(initialPosts)
		? initialPosts
		: [];
	const getLabelClass = (tagId: number) =>
		CategoryColorMap[tagId % CategoryColorMap.length];

	const posts = sortByCreatedAt(normalizedInitialPosts);

	return (
		<div>
			<div className="pl-3">
				<BreadCrumb currentThreadTitle={thread.title} />
			</div>
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col w-full items-center p-4 sm:py-7">
					<div className="text-xl sm:text-3xl font-bold break-words">
						{thread.title}
					</div>
					<div className="mt-2 flex flex-wrap justify-center gap-2">
						{thread.threadTags?.map((tag) => (
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
					<p className="text-gray-400">{formatDate(thread.createdAt)}</p>
				</div>
				<div className="w-full sm:w-1/2">
					<PostList posts={posts} />
				</div>
			</div>
			<ScrollToBottomButton />
			<div className="fixed inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4">
				<div className="max-w-2xl mx-auto">
					<CreatePostForm threadId={thread.id} />
				</div>
			</div>
		</div>
	);
}
