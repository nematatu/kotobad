"use client";

import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { AutoLinkText } from "@/components/common/AutoLinkText";
import { Link } from "@/components/common/Link";

type Props = {
	profile: UserProfileType;
};

const numberFormatter = new Intl.NumberFormat("ja-JP");

export function UserProfileActivity({ profile }: Props) {
	return (
		<div className="mt-5 grid gap-4">
			<nav className="mt-5 flex items-center gap-3 text-sm">
				<a
					href="#recent-threads"
					className="px-1 pb-2 font-semibold text-slate-800"
				>
					スレッド {numberFormatter.format(profile.threadCount)}
				</a>
				<a
					href="#recent-posts"
					className="px-1 pb-2 text-slate-500 hover:text-slate-800"
				>
					返信 {numberFormatter.format(profile.postCount)}
				</a>
			</nav>
			<section id="recent-threads" className="bg-white p-4">
				{profile.recentThreads.length === 0 ? (
					<p className="mt-3 text-sm text-slate-500">
						投稿したスレッドはありません。
					</p>
				) : (
					<ul className="mt-3 space-y-2">
						{profile.recentThreads.map((thread) => (
							<li key={thread.id} className="rounded-lg bg-slate-50 px-3 py-2">
								<Link
									href={`/threads/${thread.id}`}
									showIndicator={false}
									className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-blue-700"
								>
									{thread.title}
								</Link>
								<div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
									<span>{getRelativeDate(thread.createdAt)}</span>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>

			<section id="recent-posts" className="bg-white p-4">
				{profile.recentPosts.length === 0 ? (
					<p className="mt-3 text-sm text-slate-500">
						投稿した返信がありません
					</p>
				) : (
					<ul className="mt-3 space-y-2">
						{profile.recentPosts.map((post) => (
							<li key={post.id} className="rounded-lg bg-slate-50 px-3 py-2">
								<Link
									href={`/threads/${post.threadId}?postId=${post.id}`}
									showIndicator={false}
									className="line-clamp-1 text-xs text-slate-500 hover:text-slate-700"
								>
									{post.threadTitle} / #{post.localId}
								</Link>
								<p className="mt-1 line-clamp-2 text-sm text-slate-800">
									<AutoLinkText text={post.post} />
								</p>
								<div className="mt-1 text-xs text-slate-500">
									{getRelativeDate(post.createdAt)}
								</div>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
