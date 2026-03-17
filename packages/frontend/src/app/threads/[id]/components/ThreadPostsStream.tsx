"use client";

import type { PostListType } from "@kotobad/shared/src/types/post";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { cn } from "@/lib/utils";
import { useThreadPostRealtime } from "../hook/useThreadPostRealtime";
import {
	type ThreadViewMode,
	threadViewModeLabel,
} from "../lib/threadViewMode";
import { BackToThreadList } from "./BackToThreadList";
import { ThreadPostsFallback } from "./fallback/ThreadPostsFallback";
import { PostList } from "./PostList";

type Props = {
	threadId: number;
	highlightPostId: number | null;
	initialViewMode: ThreadViewMode;
};

const viewModeOptions: ThreadViewMode[] = ["thread", "chat"];

export const ThreadPostsStream = ({
	threadId,
	highlightPostId,
	initialViewMode,
}: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [viewMode, setViewMode] = useState<ThreadViewMode>(initialViewMode);
	const swrKey = ["GET_POSTS_BY_THREADID", threadId] as const;

	useEffect(() => {
		setViewMode(initialViewMode);
	}, [initialViewMode]);

	const handleViewModeChange = useCallback(
		(nextMode: ThreadViewMode) => {
			if (nextMode === viewMode) return;
			setViewMode(nextMode);

			const params = new URLSearchParams(searchParams.toString());
			if (nextMode === "chat") {
				params.delete("view");
			} else {
				params.set("view", nextMode);
			}
			const nextQuery = params.toString();
			router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
				scroll: false,
			});
		},
		[pathname, router, searchParams, viewMode],
	);

	const { data, error, mutate } = useSWR<PostListType>(
		swrKey,
		async ([_, id]) => {
			const baseUrl = await getBffApiUrl("GET_POSTS_BY_THREADID");
			const targetUrl = new URL(String(id), baseUrl);
			return BffFetcher<PostListType>(targetUrl, {
				method: "GET",
			});
		},
	);

	const latestPostIdRef = useRef(0);
	useEffect(() => {
		const posts = data ?? [];
		for (const post of posts) {
			if (post.id > latestPostIdRef.current) latestPostIdRef.current = post.id;
		}
	}, [data]);

	const refreshTimerRef = useRef<number | null>(null);

	const queueRefresh = useCallback(() => {
		if (refreshTimerRef.current != null) return;
		refreshTimerRef.current = window.setTimeout(() => {
			refreshTimerRef.current = null;
			void mutate();
		}, 150);
	}, [mutate]);

	useThreadPostRealtime(threadId, (postId) => {
		if (postId <= latestPostIdRef.current) return;
		queueRefresh();
	});

	const shouldShowFallback = typeof data === "undefined" && !error;
	const viewModeToggle = (
		<div className="flex justify-end">
			<div
				className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
				role="tablist"
				aria-label="投稿表示モード"
			>
				{viewModeOptions.map((mode) => (
					<button
						type="button"
						key={mode}
						role="tab"
						aria-selected={viewMode === mode}
						onClick={() => handleViewModeChange(mode)}
						className={cn(
							"rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
							viewMode === mode
								? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
								: "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
						)}
					>
						{threadViewModeLabel[mode]}
					</button>
				))}
			</div>
		</div>
	);

	if (error)
		return (
			<div id="thread-posts-top" className="flex w-full flex-col gap-3">
				{viewModeToggle}
				<div>投稿の読み込みに失敗しました。</div>
				<BackToThreadList />
				<div
					id="thread-page-bottom"
					className="h-0 w-full"
					aria-hidden="true"
				/>
			</div>
		);
	if (shouldShowFallback)
		return (
			<div id="thread-posts-top" className="flex w-full flex-col gap-3">
				{viewModeToggle}
				<ThreadPostsFallback viewMode={viewMode} />
				<BackToThreadList />
				<div
					id="thread-page-bottom"
					className="h-0 w-full"
					aria-hidden="true"
				/>
			</div>
		);
	const posts: PostListType = data ?? [];

	return (
		<div id="thread-posts-top" className="flex w-full flex-col gap-3">
			{viewModeToggle}
			<div className="w-full">
				<PostList
					posts={posts}
					threadId={threadId}
					highlightPostId={highlightPostId}
					viewMode={viewMode}
				/>
			</div>
			<BackToThreadList />
			<div id="thread-page-bottom" className="h-0 w-full" aria-hidden="true" />
		</div>
	);
};
