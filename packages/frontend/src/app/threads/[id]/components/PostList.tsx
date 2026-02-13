import type { PostListType } from "@kotobad/shared/src/types/post";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type PostListProps = {
	posts: PostListType;
};

export const PostList = ({ posts }: PostListProps) => {
	return (
		<div className="radius-sm flex flex-col">
			{posts.map((post) => (
				<div
					key={post.id}
					className={"p-4 min-h-14 flex items-center border bg-slate-50"}
				>
					<div className="flex flex-col w-full gap-2">
						<div className="flex items-center">
							<span className="text-gray-500 mr-2 text-sm">
								{post.localId ?? post.id}
							</span>
							<div className="flex items-center justify-center text-xs sm:text-sm whitespace-nowrap gap-2">
								<AuthorAvatar
									name={post.author.name}
									image={post.author.image}
									className="h-5 w-5"
									fallbackClassName="text-[8px]"
								/>
								<div className="flex gap-2 flex-wrap items-center text-xs text-gray-500">
									<span>{post.author.name}</span>
									<span>{getRelativeDate(post.createdAt)}</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<span className="block overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words ">
								{post.post}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
