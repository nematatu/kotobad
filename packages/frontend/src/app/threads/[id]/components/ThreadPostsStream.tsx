"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import { use } from "react";
import { CreatePostForm } from "./CreatePostForm";
import { PostList } from "./PostList";
import ScrollToBottomButton from "./ScrollToBottomButton";

type Props = {
	posts: Promise<PostListType>;
	threadId: number;
};

const sortByCreatedAt = (list: PostListType) =>
	[...list].sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);

export const ThreadPostsStream = ({ posts, threadId }: Props) => {
	const resolvedPosts = use(posts);
	const sortedPosts = sortByCreatedAt(
		Array.isArray(resolvedPosts) ? resolvedPosts : [],
	);

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-full sm:w-1/2">
				<PostList posts={sortedPosts} />
			</div>
			<ScrollToBottomButton />
			<div className="fixed inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4">
				<div className="max-w-2xl mx-auto">
					<CreatePostForm threadId={threadId} />
				</div>
			</div>
		</div>
	);
};
