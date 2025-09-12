"use client";

import { useState } from "react";
import { PostList } from "./PostList";
import { CreatePostForm } from "./CreatePostForm";
import { ThreadType } from "@b3s/shared/src/types";
import { PostListType } from "@b3s/shared/src/types/post";
import { getPostByThreadId } from "@/lib/api/posts";

type Props = {
	thread: ThreadType.ThreadType;
	initialPosts: PostListType;
};

export default function ThreadDetailClient({ thread, initialPosts }: Props) {
	const [posts, setPosts] = useState<PostListType>(
		[...initialPosts].sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		),
	);

	const refreshPosts = async () => {
		const latestPosts = await getPostByThreadId(thread.id);

		// エラー判定
		if ("error" in latestPosts) {
			console.error(latestPosts.error);
			return;
		}
		setPosts(
			[...latestPosts].sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			),
		);
	};

	return (
		<div className="p-6">
			<div className="flex pb-6 justify-between items-start">
				<div className="text-2xl sm:text-3xl font-bold max-w-[80%] break-words">
					{thread.title}
				</div>
				<p className="text-gray-400">
					{new Date(thread.createdAt).toLocaleString()}
				</p>
			</div>
			<PostList posts={posts} />
			<CreatePostForm threadId={thread.id} onSuccess={refreshPosts} />
		</div>
	);
}
