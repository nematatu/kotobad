"use client";

import { useEffect, useState } from "react";
import type { PostListType } from "@b3s/shared/src/types/post";
import { formatDate } from "@/utils/date/formatDate";
import { getRelativeDate } from "@/utils/date/getRelativeDate";

type PostListProps = {
	posts: PostListType;
};

export const PostList = ({ posts }: PostListProps) => {
	const [postList, setPostList] = useState<PostListType>(posts);

	useEffect(() => {
		setPostList(posts);
	}, [posts]);

	return (
		<div className="radius-sm flex flex-col sm:p-5">
			{postList.map((post) => (
				<div
					key={post.id}
					className={`p-4 min-h-14 flex items-center border  hover:bg-gray-100 dark:hover:bg-gray-800`}
				>
					<div className="flex-col flex sm:flex-row justify-between text-sm sm:text-base w-full">
						<div className="min-w-0 flex-1 pr-4">
							<span className="font-bold  block overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words ">
								{post.post}
							</span>
							<span className="text-gray-500 text-sm">
								{getRelativeDate(post.createdAt)}
							</span>
						</div>
						<div className="flex flex-col items-end gap-y-1 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
							<span>作成者: {post.author?.username}</span>
							<span>{formatDate(post.createdAt)}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
