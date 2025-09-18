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
				<div key={post.id} className={`p-4 min-h-14 flex items-center border`}>
					<div className="flex-col flex sm:flex-row justify-between text-sm sm:text-base w-full">
						<div className="flex-col">
							<div className="flex">
								<span className="text-gray-500 mr-2 text-sm">{post.id}</span>
								<div className="gap-y-1 text-xs sm:text-sm whitespace-nowrap space-x-2">
									<span className="text-black">{post.author?.username}</span>
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
								{getRelativeDate(post.createdAt)}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
