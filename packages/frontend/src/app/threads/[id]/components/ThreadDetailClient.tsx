"use client";

import { PostListSchema } from "@kotobad/shared/src/schemas/post";
import type { PostListType } from "@kotobad/shared/src/types/post";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useEffect, useState } from "react";
import BottomArrowIcon from "@/assets/threads/bottom_arrow.svg";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";
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
	const getLabelClass = (tagId: number) =>
		CategoryColorMap[tagId % CategoryColorMap.length];

	const [posts, setPosts] = useState<PostListType>(
		sortByCreatedAt(normalizedInitialPosts),
	);

	const refreshPosts = async () => {
		try {
			const getPostsBaseUrl = await getBffApiUrl("GET_POSTS_BY_THREADID");
			const getPostsTargetUrl = new URL(String(thread.id), getPostsBaseUrl);
			const getPostsRes = await fetch(getPostsTargetUrl);
			const postsBody = await getPostsRes.json();
			const targetPosts = PostListSchema.parse(postsBody);

			if (!Array.isArray(targetPosts)) {
				console.error("レスポンス形式が不正です", targetPosts);
				return;
			}
			setPosts(sortByCreatedAt(targetPosts));
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
			<div className="fixed inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4">
				<div className="max-w-2xl mx-auto">
					<CreatePostForm threadId={thread.id} onSuccess={refreshPosts} />
				</div>
			</div>
		</div>
	);
}
