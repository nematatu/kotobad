"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { BackToThreadList } from "./BackToThreadList";
import { ThreadPostsFallback } from "./fallback/ThreadPostsFallback";
import NoPost from "./NoPost";
import { PostList } from "./PostList";

type Props = {
	threadId: number;
	initialPostCount: number;
	highlightPostId: number | null;
};

export const ThreadPostsStream = ({
	threadId,
	initialPostCount,
	highlightPostId,
}: Props) => {
	const swrKey = ["GET_POSTS_BY_THREADID", threadId] as const;

	const { data, error, isLoading } = useSWR<PostListType>(
		swrKey,
		async ([_, id]) => {
			const baseUrl = await getBffApiUrl("GET_POSTS_BY_THREADID");
			const targetUrl = new URL(String(id), baseUrl);
			return BffFetcher<PostListType>(targetUrl, {
				method: "GET",
			});
		},
	);

	if (error) return <div>投稿の読み込みに失敗しました。</div>;
	if (isLoading && initialPostCount > 0) return <ThreadPostsFallback />;
	const posts: PostListType = data ?? [];
	const hasPosts = posts.length > 0;

	return (
		<div id="thread-posts-top" className="flex w-full flex-col gap-3">
			<div className="w-full">
				{hasPosts ? (
					<PostList
						posts={posts}
						threadId={threadId}
						highlightPostId={highlightPostId}
					/>
				) : (
					<NoPost />
				)}
			</div>
			<BackToThreadList />
			<div id="thread-page-bottom" className="h-0 w-full" aria-hidden="true" />
		</div>
	);
};
