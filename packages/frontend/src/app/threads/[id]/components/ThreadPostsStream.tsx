"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import { useState } from "react";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { CreatePostForm } from "./CreatePostForm";
import { ThreadPostsFallback } from "./fallback/ThreadPostsFallback";
import NoPost from "./NoPost";
import { PostList } from "./PostList";
import ScrollToBottomButton from "./ScrollToBottomButton";

type Props = {
	threadId: number;
	initialPostCount: number;
};

export const ThreadPostsStream = ({ threadId, initialPostCount }: Props) => {
	const [hasNewPost, setHasNewPost] = useState(false);
	const shouldFetchPosts = initialPostCount > 0 || hasNewPost;
	const swrKey = shouldFetchPosts
		? (["GET_POSTS_BY_THREADID", threadId] as const)
		: null;

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
	if (swrKey && isLoading) return <ThreadPostsFallback />;
	const posts: PostListType = swrKey ? (data ?? []) : [];
	const hasPosts = posts.length > 0;

	return (
		<div
			id="thread-posts-top"
			className="flex flex-col items-center justify-center pb-8"
		>
			<div className="w-full sm:w-1/2">
				{hasPosts ? <PostList posts={posts} /> : <NoPost />}
			</div>
			{hasPosts ? <ScrollToBottomButton /> : null}
			<div id="thread-post-form" className="w-full sm:w-1/2 mt-6 px-1 sm:px-0">
				<CreatePostForm
					threadId={threadId}
					onPostedAction={() => setHasNewPost(true)}
				/>
			</div>
			<div id="thread-page-bottom" className="h-0 w-full" aria-hidden="true" />
		</div>
	);
};
