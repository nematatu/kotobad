"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
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
	if (!data) return <div>投稿がありません。</div>;

	const posts: PostListType = data;

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-full sm:w-1/2">
				<PostList posts={posts} />
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
