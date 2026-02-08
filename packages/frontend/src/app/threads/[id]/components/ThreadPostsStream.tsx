"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import Image from "next/image";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { CreatePostForm } from "./CreatePostForm";
import { ThreadPostsFallback } from "./fallback/ThreadPostsFallback";
import { PostList } from "./PostList";
import ScrollToBottomButton from "./ScrollToBottomButton";

type Props = {
	threadId: number;
};

export const ThreadPostsStream = ({ threadId }: Props) => {
	const { data, error, isLoading } = useSWR<PostListType>(
		["GET_POSTS_BY_THREADID", threadId] as const,
		async ([_, id]) => {
			const baseUrl = await getBffApiUrl("GET_POSTS_BY_THREADID");
			const targetUrl = new URL(String(id), baseUrl);
			return BffFetcher<PostListType>(targetUrl, {
				method: "GET",
			});
		},
	);

	if (error) return <div>投稿の読み込みに失敗しました。</div>;
	if (isLoading) return <ThreadPostsFallback />;
	const posts: PostListType = data ?? [];
	const hasPosts = posts.length > 0;

	return (
		<div
			id="thread-posts-top"
			className="flex flex-col items-center justify-center pb-8"
		>
			<div className="w-full sm:w-1/2">
				{hasPosts ? (
					<PostList posts={posts} />
				) : (
					<div className="flex flex-col items-center justify-center min-h-[45vh] overflow-hidden space-y-5">
						<Image
							src="/file.svg"
							alt=""
							aria-hidden="true"
							width={300}
							height={300}
							className="w-[40%] object-contain opacity-20"
						/>
						<p className="text-md text-slate-500 font-semibold">
							投稿してみましょう !
						</p>
					</div>
				)}
			</div>
			{hasPosts ? <ScrollToBottomButton /> : null}
			<div id="thread-post-form" className="w-full sm:w-1/2 mt-6 px-1 sm:px-0">
				<CreatePostForm threadId={threadId} />
			</div>
			<div id="thread-page-bottom" className="h-0 w-full" aria-hidden="true" />
		</div>
	);
};
