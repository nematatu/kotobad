"use client";

import type {
	FavoritePlayerType,
	UserProfileType,
} from "@kotobad/shared/src/types/user";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { Search } from "lucide-react";
import { useState } from "react";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";
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

	return (
		<div className="mx-auto w-full max-w-[1070px] bg-white pb-6 [font-family:Roboto,Arial,sans-serif] sm:pb-8">
			<div className="space-y-6">
				<div className="h-[1px] w-full bg-[#e5e5e5] my-8" />
				<div className="flex items-center justify-between gap-2">
					<p className="line-clamp-1 text-[#0f0f0f] font-bold sm:text-lg sm:leading-[20px]">
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
					<div className="mt-3 flex flex-wrap gap-x-7 gap-y-1.5">
						{favoritePlayers.map((player) => (
							<FavoritePlayerImageCard key={player.id} player={player} />
						))}
					</div>
				) : null}
			</div>
			<nav className="flex h-12 items-end gap-8 border-b border-[#e5e5e5]">
				<button
					type="button"
					onClick={() => setActiveTab("threads")}
					className={`relative h-12 px-0 text-[14px] font-medium ${
						activeTab === "threads"
							? "text-[#0f0f0f]"
							: "text-[#606060] [@media(hover:hover)]:hover:text-[#0f0f0f]"
					}`}
				>
					スレッド
					{activeTab === "threads" ? (
						<span className="absolute right-0 bottom-0 left-0 h-[3px] bg-[#0f0f0f]" />
					) : null}
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("posts")}
					className={`relative h-12 px-0 text-[14px] font-medium ${
						activeTab === "posts"
							? "text-[#0f0f0f]"
							: "text-[#606060] [@media(hover:hover)]:hover:text-[#0f0f0f]"
					}`}
				>
					返信
					{activeTab === "posts" ? (
						<span className="absolute right-0 bottom-0 left-0 h-[3px] bg-[#0f0f0f]" />
					) : null}
				</button>
				<button
					type="button"
					aria-label="検索"
					className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#606060] transition-colors [@media(hover:hover)]:hover:bg-slate-100 [@media(hover:hover)]:hover:text-[#0f0f0f]"
				>
					<Search className="h-6 w-6" />
				</button>
			</nav>
			{activeTab === "threads" ? (
				<section id="recent-threads">
					{profile.recentThreads.length === 0 ? (
						<p className="mt-6 text-sm text-[#606060]">
							このチャンネルにはコンテンツがありません
						</p>
					) : (
						<ul className="mt-3">
							{profile.recentThreads.map((thread) => (
								<li key={thread.id} className="border-b border-[#e5e5e5] py-3">
									<Link
										href={`/threads/${thread.id}`}
										showIndicator={false}
										className="line-clamp-1 text-[15px] font-medium text-[#0f0f0f] [@media(hover:hover)]:hover:text-blue-700"
									>
										{thread.title}
									</Link>
									<div className="mt-1 text-xs text-[#606060]">
										{getRelativeDate(thread.createdAt)}
									</div>
								</li>
							))}
						</ul>
					)}
				</section>
			) : (
				<section id="recent-posts">
					{profile.recentPosts.length === 0 ? (
						<p className="mt-6 text-sm text-[#606060]">返信はまだありません</p>
					) : (
						<ul className="mt-3">
							{profile.recentPosts.map((post) => (
								<li key={post.id} className="border-b border-[#e5e5e5] py-3">
									<Link
										href={`/threads/${post.threadId}?postId=${post.id}`}
										showIndicator={false}
										className="line-clamp-1 text-xs text-[#606060] [@media(hover:hover)]:hover:text-[#0f0f0f]"
									>
										{post.threadTitle} / #{post.localId}
									</Link>
									<p className="mt-1 line-clamp-2 text-sm text-[#0f0f0f]">
										<AutoLinkText text={post.post} />
									</p>
									<div className="mt-1 text-xs text-[#606060]">
										{getRelativeDate(post.createdAt)}
									</div>
								</li>
							))}
						</ul>
					)}
				</section>
			)}
		</div>
	);
}
