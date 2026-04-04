"use client";

import type { ThreadType } from "@kotobad/shared/src/types/thread";
import type {
	FavoritePlayerType,
	UserProfileType,
} from "@kotobad/shared/src/types/user";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { useState } from "react";
import { ThreadList } from "@/app/threads/components/view/ThreadList";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { FavoritePlayerImageCard } from "./FavoritePlayerImageCard";

type Props = {
	profile: UserProfileType;
	favoritePlayers: FavoritePlayerType[];
	isEditing: boolean;
	onOpenFavoritePlayersSelectAction: () => void;
};

type ProfileTab = "threads" | "posts";

export function UserProfileActivity({
	profile,
	favoritePlayers,
	isEditing,
	onOpenFavoritePlayersSelectAction,
}: Props) {
	const [activeTab, setActiveTab] = useState<ProfileTab>("threads");
	const timelineThreads: ThreadType[] = profile.recentThreads.map((thread) => ({
		id: thread.id,
		title: thread.title,
		imageUrls: [],
		createdAt: thread.createdAt,
		updatedAt: null,
		postCount: thread.postCount,
		authorId: profile.id,
		author: {
			name: profile.name,
			image: profile.image ?? null,
			bio: profile.bio,
		},
		threadTags: [],
		likeCount: 0,
		likedByMe: false,
	}));

	return (
		<div className="mx-auto mt-9 w-full max-w-[1070px] bg-white pb-10 text-[#0f0f0f] dark:bg-slate-950 dark:text-slate-100 [font-family:Roboto,Arial,sans-serif] sm:mt-8 sm:pb-10">
			<div className="space-y-7">
				<div className="h-[1px] w-full bg-[#e5e5e5] dark:bg-slate-800" />
				<div className="flex items-center justify-between gap-2">
					<p className="line-clamp-1 font-bold sm:text-lg sm:leading-[20px]">
						推し選手
					</p>
					{isEditing ? (
						<button
							type="button"
							className="text-xs text-blue-600 sm:text-[13px]"
							onClick={onOpenFavoritePlayersSelectAction}
						>
							選択する
						</button>
					) : null}
				</div>
				{favoritePlayers.length > 0 ? (
					<div className="flex flex-wrap gap-x-5 gap-y-4 sm:gap-x-7">
						{favoritePlayers.map((player) => (
							<FavoritePlayerImageCard
								key={player.id}
								player={player}
								enablePreview
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-[#606060] dark:text-slate-400">
						推し選手は未選択です
					</p>
				)}
			</div>
			<div className="mt-10 w-full sm:mt-9">
				<nav className="flex h-12 items-end gap-6 border-b border-[#e5e5e5] px-3 dark:border-slate-800">
					<button
						type="button"
						onClick={() => setActiveTab("threads")}
						className={`relative h-12 px-0 text-[14px] font-medium cursor-pointer ${
							activeTab === "threads"
								? "text-[#0f0f0f] dark:text-slate-100"
								: "text-[#606060] [@media(hover:hover)]:hover:text-[#0f0f0f] dark:text-slate-400 dark:[@media(hover:hover)]:hover:text-slate-100"
						}`}
					>
						スレッド
						{activeTab === "threads" ? (
							<span className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#0f0f0f] dark:bg-slate-100" />
						) : null}
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("posts")}
						className={`relative h-12 px-0 text-[14px] font-medium cursor-pointer ${
							activeTab === "posts"
								? "text-[#0f0f0f] dark:text-slate-100"
								: "text-[#606060] [@media(hover:hover)]:hover:text-[#0f0f0f] dark:text-slate-400 dark:[@media(hover:hover)]:hover:text-slate-100"
						}`}
					>
						返信
						{activeTab === "posts" ? (
							<span className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#0f0f0f] dark:bg-slate-100" />
						) : null}
					</button>
				</nav>
				{activeTab === "threads" ? (
					<section id="recent-threads" className="pt-5 sm:pt-4">
						{profile.recentThreads.length === 0 ? (
							<p className="mt-6 px-3 text-sm text-[#606060] dark:text-slate-400">
								スレッドはまだありません
							</p>
						) : (
							<div className="mt-0">
								<ThreadList threads={timelineThreads} />
							</div>
						)}
					</section>
				) : null}
				{activeTab === "posts" ? (
					<section id="recent-posts" className="pt-5 sm:pt-4">
						{profile.recentPosts.length === 0 ? (
							<p className="mt-6 px-3 text-sm text-[#606060] dark:text-slate-400">
								返信はまだありません
							</p>
						) : (
							<ul className="divide-y divide-[#e5e5e5] dark:divide-slate-800">
								{profile.recentPosts.map((post) => (
									<li key={post.id} className="px-3 py-5 sm:py-4">
										<div className="flex items-start gap-3">
											<AuthorAvatar
												name={profile.name}
												image={profile.image}
												className="h-10 w-10 bg-white"
											/>
											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-x-2 text-sm">
													<span className="font-semibold text-[#0f0f0f] dark:text-slate-100">
														{profile.name}
													</span>
													<span className="text-[#606060] dark:text-slate-400">
														{getRelativeDate(post.createdAt)}
													</span>
												</div>
												<p className="mt-1 whitespace-pre-line break-words text-[15px] leading-6 text-[#0f0f0f] dark:text-slate-100">
													<AutoLinkText text={post.post} />
												</p>
												<Link
													href={`/threads/${post.threadId}?postId=${post.id}`}
													showIndicator={false}
													className="mt-3 block rounded-2xl border border-[#e5e5e5] p-3 [@media(hover:hover)]:hover:bg-[#f8fafc] dark:border-slate-700 dark:[@media(hover:hover)]:hover:bg-slate-900"
												>
													<p className="text-xs text-[#606060] dark:text-slate-400">
														返信先スレッド
													</p>
													<p className="mt-1 line-clamp-2 text-sm text-[#0f0f0f] dark:text-slate-100">
														{post.threadTitle}
													</p>
													<p className="mt-1 text-xs text-[#606060] dark:text-slate-400">
														#{post.localId}
													</p>
												</Link>
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</section>
				) : null}
			</div>
		</div>
	);
}
