"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import { useState } from "react";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { BackToThreadList } from "./BackToThreadList";
import { CreatePostForm } from "./CreatePostForm";
import { ThreadPostsFallback } from "./fallback/ThreadPostsFallback";
import NoPost from "./NoPost";
import { PostList } from "./PostList";
import type { ReplyTarget } from "./types/replyTarget";

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
	const [hasNewPost, setHasNewPost] = useState(false);
	const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
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
	const handleReplyAction = (target: ReplyTarget) => {
		setReplyTarget(target);
		document.getElementById("thread-post-form")?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	};

	return (
		<div
			id="thread-posts-top"
			className="flex flex-col w-full items-center space-y-3"
		>
			<div className="md:w-1/2 [@media(max-width:1290px)]:w-full">
				{hasPosts ? (
					<PostList
						posts={posts}
						highlightPostId={highlightPostId}
						onReplyAction={handleReplyAction}
					/>
				) : (
					<NoPost />
				)}
			</div>
			<BackToThreadList />
			<div
				id="thread-post-form"
				className="md:w-1/2 [@media(max-width:1290px)]:w-full"
			>
				<CreatePostForm
					threadId={threadId}
					replyTarget={replyTarget}
					onPostedAction={() => {
						setHasNewPost(true);
						setReplyTarget(null);
					}}
					onClearReplyTargetAction={() => setReplyTarget(null)}
				/>
			</div>
			<div id="thread-page-bottom" className="h-0 w-full" aria-hidden="true" />
		</div>
	);
};
