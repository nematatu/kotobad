import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import Link from "next/link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type Props = {
	profile: UserProfileType;
};

const numberFormatter = new Intl.NumberFormat("ja-JP");

export function UserProfileView({ profile }: Props) {
	return (
		<div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6">
			<section className="overflow-hidden bg-white">
				<div className="h-24 bg-[linear-gradient(135deg,#93c5fd_0%,#dbeafe_42%,#cffafe_100%)] sm:h-32" />
				<div className="-mt-12 px-4 pb-6 sm:-mt-14 sm:px-6">
					<AuthorAvatar
						name={profile.name}
						image={profile.image}
						className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white"
						fallbackClassName="text-lg"
					/>
					<div className="space-y-4">
						<div className="mt-3 flex flex-col flex-wrap gap-x-3 gap-y-1">
							<h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
								{profile.name}
							</h1>
							<span
								className="text-xs text-slate-400 sm:text-sm"
								title={profile.id}
							>
								@{profile.id}
							</span>
						</div>
						<p className="mt-2 text-sm text-slate-600">{profile.bio ?? ""}</p>
					</div>
					<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
						<span className="rounded-full bg-slate-100 px-2 py-1">
							登録日: {formatDate(profile.createdAt, { withTime: false })}
						</span>
					</div>
				</div>
			</section>

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
								<li
									key={thread.id}
									className="rounded-lg bg-slate-50 px-3 py-2"
								>
									<Link
										href={`/threads/${thread.id}`}
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
										className="line-clamp-1 text-xs text-slate-500 hover:text-slate-700"
									>
										{post.threadTitle} / #{post.localId}
									</Link>
									<p className="mt-1 line-clamp-2 text-sm text-slate-800">
										{post.post}
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
		</div>
	);
}
