"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useEffect, useState } from "react";
import BottomArrowIcon from "@/assets/threads/bottom_arrow.svg";
import { getPostByThreadId } from "@/lib/api/posts";
import BreadCrumb from "./BreadCrumbs";
import { CreatePostForm } from "./CreatePostForm";
import { PostList } from "./PostList";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
	timeZone: "Asia/Tokyo",
});

const formatDateTime = (value: string | number | Date) =>
	dateFormatter.format(new Date(value));

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

	const [posts, setPosts] = useState<PostListType>(
		sortByCreatedAt(normalizedInitialPosts),
	);

	const refreshPosts = async () => {
		try {
			const latestPosts = await getPostByThreadId(thread.id);
			if (!Array.isArray(latestPosts)) {
				console.error("レスポンス形式が不正です", latestPosts);
				return;
			}
			setPosts(sortByCreatedAt(latestPosts));
		} catch (error) {
			console.error("投稿の取得に失敗しました", error);
		}
	};

	const [showScrollBotton, setShowScrollBotton] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const scrolledToBottom =
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 20;
			setShowScrollBotton(!scrolledToBottom);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	});

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
					<p className="text-gray-400">{formatDateTime(thread.createdAt)}</p>
				</div>
				<div className="w-full sm:w-1/2">
					<PostList posts={posts} />
				</div>
			</div>
			<div
				className={`fixed sm:bottom-10 sm:right-10 bottom-3 right-3 transition-opacity duration-100
                ${showScrollBotton ? "opacity-100" : " opacity-0 pointer-events-none"}
                `}
			>
				<button
					type="button"
					onClick={() =>
						window.scrollTo({
							top: document.body.scrollHeight,
							behavior: "smooth",
						})
					}
				>
					<BottomArrowIcon className="text-gray-600 w-20 h-20 p-4 cursor-pointer" />
				</button>
			</div>
			<div className="flex justify-center">
				<CreatePostForm threadId={thread.id} onSuccess={refreshPosts} />
			</div>
		</div>
	);
}
