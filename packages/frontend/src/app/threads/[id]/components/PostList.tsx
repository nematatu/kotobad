"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { useEffect, useState } from "react";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type PostListProps = {
	posts: PostListType;
};

export const PostList = ({ posts }: PostListProps) => {
	const [postList, setPostList] = useState<PostListType>(posts);

	useEffect(() => {
		setPostList(posts);
	}, [posts]);

	return (
		<div className="radius-sm flex flex-col">
			{postList.map((post, i) => (
				<div
					key={post.id}
					className={`p-4 min-h-14 flex items-center border ${i % 2 === 0 ? "bg-gray-100 dark:bg-gray-950" : ""}`}
				>
					<div className="flex-col flex sm:flex-row justify-between text-sm sm:text-base w-full">
						<div className="flex-col">
							<div className="flex items-center">
								<span className="text-gray-500 mr-2 text-sm">
									{post.localId ?? post.id}
								</span>
								<div className="flex items-center justify-center gap-y-1 text-xs sm:text-sm whitespace-nowrap space-x-1">
									<AuthorAvatar
										name={post.author.name}
										image={post.author.image}
										className="h-6 w-6 border-gray-300"
										fallbackClassName="text-[8px]"
									/>
									<span className="text-gray-500">
										{formatDate(post.createdAt)}
									</span>
								</div>
							</div>
							<div className="flex-1">
								<span className="block overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words ">
									{post.post}
								</span>
							</div>
							<span className="text-gray-500 text-sm">
								{getRelativeDate(post.createdAt).relativeDate}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
