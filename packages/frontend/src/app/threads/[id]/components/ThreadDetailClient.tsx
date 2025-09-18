"use client";

import { useState } from "react";
import { PostList } from "./PostList";
import { CreatePostForm } from "./CreatePostForm";
import { ThreadType } from "@b3s/shared/src/types";
import { PostListType } from "@b3s/shared/src/types/post";
import { getPostByThreadId } from "@/lib/api/posts";
import BreadCrumb from "./BreadCrumbs";
import BottomArrowIcon from "@/assets/threads/bottom_arrow.svg";

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
		<div>
			<BreadCrumb currentThreadTitle={thread.title} />
			<div className="flex flex-col items-center justify-center">
				<div className="text-2xl sm:text-3xl justify-start font-bold max-w-[50%] break-words">
					{thread.title}
				</div>
				<p className="text-gray-400">
					{new Date(thread.createdAt).toLocaleString()}
				</p>
				<div className="sm:w-1/2">
					<PostList posts={posts} />
				</div>
			</div>
			<div className="fixed bottom-10 right-10">
				<button
					onClick={() =>
						window.scrollTo({
							top: document.body.scrollHeight,
							behavior: "instant",
						})
					}
				>
					<BottomArrowIcon
						style={{ width: 100, height: 100 }}
						className="text-primary-100 p-4 cursor-pointer"
					/>
				</button>
			</div>
			<div className="flex justify-center">
				<CreatePostForm threadId={thread.id} onSuccess={refreshPosts} />
			</div>
		</div>
	);
}
