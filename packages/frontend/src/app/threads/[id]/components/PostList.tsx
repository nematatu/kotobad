"use client";

import {
	SetPostReactionsResponseSchema,
	SetPostReactionsScheme,
} from "@kotobad/shared/src/schemas/post";
import { ReactionOptionListSchema } from "@kotobad/shared/src/schemas/reaction";
import type { PostListType, PostType } from "@kotobad/shared/src/types/post";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { toReplyTarget } from "./lib/postListViewHelpers";
import { ThreadPostListView } from "./ThreadPostListView";
import type { FlattenedPostItem } from "./types/flattenedPostItem";
import type { ReplyTarget } from "./types/replyTarget";

type PostListProps = {
	posts: PostListType;
	threadId: number;
	highlightPostId: number | null;
};

const LARGE_LIST_DISABLE_ENTER_ANIMATION = 80;
const LARGE_LIST_DISABLE_LAYOUT_ANIMATION = 120;

const getVisibleFlattenedPosts = (
	posts: PostListType,
	expandedReplyPostIdSet: Set<number>,
): FlattenedPostItem[] => {
	if (posts.length === 0) {
		return [];
	}

	const nodeMap = new Map<number, PostType>();
	for (const post of posts) {
		nodeMap.set(post.id, post);
	}

	const childrenByParentId = new Map<number, PostType[]>();
	const roots: PostType[] = [];
	for (const post of posts) {
		const parentId = post.replyToPostId;
		if (typeof parentId === "number" && nodeMap.has(parentId)) {
			const siblings = childrenByParentId.get(parentId);
			if (siblings) {
				siblings.push(post);
			} else {
				childrenByParentId.set(parentId, [post]);
			}
			continue;
		}
		roots.push(post);
	}

	const visibleFlattened: FlattenedPostItem[] = [];
	const stack: Array<{
		post: PostType;
		depth: number;
		ancestorsExpanded: boolean;
	}> = [];

	for (let index = roots.length - 1; index >= 0; index -= 1) {
		const root = roots[index];
		if (!root) continue;
		stack.push({
			post: root,
			depth: 0,
			ancestorsExpanded: true,
		});
	}

	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) continue;

		const isVisible =
			current.depth <= 1 || (current.depth > 1 && current.ancestorsExpanded);
		if (isVisible) {
			visibleFlattened.push({
				post: current.post,
				depth: current.depth,
			});
		}

		const children = childrenByParentId.get(current.post.id);
		if (!children || children.length === 0) {
			continue;
		}

		const canRevealDeeperReplies =
			current.depth === 0
				? true
				: current.ancestorsExpanded &&
					expandedReplyPostIdSet.has(current.post.id);

		if (!canRevealDeeperReplies && current.depth >= 1) {
			continue;
		}

		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (!child) continue;
			stack.push({
				post: child,
				depth: current.depth + 1,
				ancestorsExpanded: canRevealDeeperReplies,
			});
		}
	}

	return visibleFlattened;
};

export const PostList = ({
	posts,
	threadId,
	highlightPostId,
}: PostListProps) => {
	const [localPosts, setLocalPosts] = useState<PostListType>(posts);
	const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
	const [expandedReplyPostIds, setExpandedReplyPostIds] = useState<number[]>(
		[],
	);
	const [replyEnterPostIds, setReplyEnterPostIds] = useState<number[]>([]);
	const [realtimeEnterPostIds, setRealtimeEnterPostIds] = useState<number[]>(
		[],
	);
	const [openReactionPostId, setOpenReactionPostId] = useState<number | null>(
		null,
	);
	const [openMobileActionPostId, setOpenMobileActionPostId] = useState<
		number | null
	>(null);
	const [highlightAnimatingPostId, setHighlightAnimatingPostId] = useState<
		number | null
	>(null);

	const previousVisiblePostIdsRef = useRef<number[] | null>(null);
	const previousPostIdsRef = useRef<number[] | null>(null);
	const previousHighlightPostIdRef = useRef<number | null>(null);

	const { data: reactionOptions = [] } = useSWRImmutable(
		"GET_REACTION_OPTIONS",
		async () => {
			const endpoint = await getBffApiUrl("GET_REACTION_OPTIONS");
			const raw = await BffFetcher<unknown>(endpoint, {
				method: "GET",
			});
			return ReactionOptionListSchema.parse(raw);
		},
	);

	const reactionCodes = reactionOptions.map((item) => item.reactionCode);
	const postLocalIdMap = useMemo(() => {
		return new Map(localPosts.map((post) => [post.id, post.localId]));
	}, [localPosts]);
	const expandedReplyPostIdSet = useMemo(() => {
		return new Set(expandedReplyPostIds);
	}, [expandedReplyPostIds]);
	const visibleFlattenedPosts = useMemo(() => {
		return getVisibleFlattenedPosts(localPosts, expandedReplyPostIdSet);
	}, [localPosts, expandedReplyPostIdSet]);
	const replyEnterPostIdSet = useMemo(() => {
		return new Set(replyEnterPostIds);
	}, [replyEnterPostIds]);
	const realtimeEnterPostIdSet = useMemo(() => {
		return new Set(realtimeEnterPostIds);
	}, [realtimeEnterPostIds]);

	useEffect(() => {
		const nextPostIds = posts.map((post) => post.id);
		const previousPostIds = previousPostIdsRef.current;
		previousPostIdsRef.current = nextPostIds;
		setLocalPosts(posts);

		if (!previousPostIds) {
			return;
		}

		const previousPostIdSet = new Set(previousPostIds);
		const enteringPostIds = nextPostIds.filter(
			(id) => !previousPostIdSet.has(id),
		);
		if (enteringPostIds.length === 0) {
			return;
		}

		setRealtimeEnterPostIds((prev) => {
			const merged = new Set(prev);
			for (const id of enteringPostIds) {
				merged.add(id);
			}
			return [...merged];
		});

		const enteringPostIdSet = new Set(enteringPostIds);
		const timeoutId = window.setTimeout(() => {
			setRealtimeEnterPostIds((prev) =>
				prev.filter((id) => !enteringPostIdSet.has(id)),
			);
		}, 460);

		return () => window.clearTimeout(timeoutId);
	}, [posts]);

	useEffect(() => {
		if (!replyTarget) return;
		if (postLocalIdMap.has(replyTarget.postId)) return;
		setReplyTarget(null);
	}, [postLocalIdMap, replyTarget]);

	useEffect(() => {
		if (openReactionPostId === null) return;
		if (postLocalIdMap.has(openReactionPostId)) return;
		setOpenReactionPostId(null);
	}, [openReactionPostId, postLocalIdMap]);

	useEffect(() => {
		if (openMobileActionPostId === null) return;
		if (postLocalIdMap.has(openMobileActionPostId)) return;
		setOpenMobileActionPostId(null);
	}, [openMobileActionPostId, postLocalIdMap]);

	useEffect(() => {
		const currentVisiblePostIds = visibleFlattenedPosts.map(
			({ post }) => post.id,
		);
		const previousVisiblePostIds = previousVisiblePostIdsRef.current;
		previousVisiblePostIdsRef.current = currentVisiblePostIds;

		if (!previousVisiblePostIds) {
			return;
		}

		const previousVisiblePostIdSet = new Set(previousVisiblePostIds);
		const enteringReplyPostIds = visibleFlattenedPosts
			.filter(
				({ post, depth }) =>
					depth > 0 && !previousVisiblePostIdSet.has(post.id),
			)
			.map(({ post }) => post.id);

		if (enteringReplyPostIds.length === 0) {
			return;
		}

		setReplyEnterPostIds(enteringReplyPostIds);
		const enteringReplyPostIdSet = new Set(enteringReplyPostIds);
		const timeoutId = window.setTimeout(() => {
			setReplyEnterPostIds((prev) =>
				prev.filter((id) => !enteringReplyPostIdSet.has(id)),
			);
		}, 420);

		return () => window.clearTimeout(timeoutId);
	}, [visibleFlattenedPosts]);

	/* biome-ignore lint/correctness/useExhaustiveDependencies: highlighted post may appear after the initial render, so visibleFlattenedPosts is intentionally included to retry DOM lookup. */
	useEffect(() => {
		if (!highlightPostId) return;
		const targetElement = document.getElementById(
			`post-${highlightPostId}`,
		) as HTMLElement | null;
		if (!targetElement) return;

		if (previousHighlightPostIdRef.current === highlightPostId) {
			return;
		}

		previousHighlightPostIdRef.current = highlightPostId;

		targetElement.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "nearest",
		});
		setHighlightAnimatingPostId(highlightPostId);
	}, [highlightPostId, visibleFlattenedPosts]);

	useEffect(() => {
		if (!highlightAnimatingPostId) return;

		const timeoutId = window.setTimeout(() => {
			setHighlightAnimatingPostId((current) =>
				current === highlightAnimatingPostId ? null : current,
			);
		}, 2200);

		return () => window.clearTimeout(timeoutId);
	}, [highlightAnimatingPostId]);

	const handleReaction = async (postId: number, reactionCode: string) => {
		const post = localPosts.find((item) => item.id === postId);
		if (!post) return;

		const current = post.reactions.find(
			(item) => item.reactionCode === reactionCode,
		);
		const active = !(current?.reactedByMe ?? false);

		try {
			const endpoint = await getBffApiUrl("SET_POST_REACTIONS");
			const requestBody = SetPostReactionsScheme.parse({
				postId,
				reactionCode,
				active,
			});

			const raw = await BffFetcher<unknown>(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const response = SetPostReactionsResponseSchema.parse(raw);

			setLocalPosts((prev) =>
				prev.map((item) =>
					item.id === response.postId
						? { ...item, reactions: response.reactions }
						: item,
				),
			);
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				return;
			}
			console.error("Failed to set post reaction", error);
		}
	};

	const toggleReplies = (postId: number) => {
		setExpandedReplyPostIds((prev) =>
			prev.includes(postId)
				? prev.filter((id) => id !== postId)
				: [...prev, postId],
		);
	};

	const toggleReplyTarget = (post: PostType) => {
		setReplyTarget((current) =>
			current?.postId === post.id ? null : toReplyTarget(post),
		);
	};

	const clearReplyTarget = () => {
		setReplyTarget(null);
	};

	const visiblePostCount = visibleFlattenedPosts.length;
	const disableEnterAnimation =
		visiblePostCount > LARGE_LIST_DISABLE_ENTER_ANIMATION;
	const enableLayoutAnimation =
		visiblePostCount <= LARGE_LIST_DISABLE_LAYOUT_ANIMATION;

	return (
		<ThreadPostListView
			threadId={threadId}
			visibleFlattenedPosts={visibleFlattenedPosts}
			expandedReplyPostIdSet={expandedReplyPostIdSet}
			replyEnterPostIdSet={replyEnterPostIdSet}
			realtimeEnterPostIdSet={realtimeEnterPostIdSet}
			highlightAnimatingPostId={highlightAnimatingPostId}
			replyTarget={replyTarget}
			reactionCodes={reactionCodes}
			disableEnterAnimation={disableEnterAnimation}
			enableLayoutAnimation={enableLayoutAnimation}
			onToggleReplyTargetAction={toggleReplyTarget}
			onClearReplyTargetAction={clearReplyTarget}
			onToggleRepliesAction={toggleReplies}
			onReactAction={handleReaction}
		/>
	);
};
