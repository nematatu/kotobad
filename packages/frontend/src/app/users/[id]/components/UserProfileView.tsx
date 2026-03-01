"use client";

import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { Check, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import IconButton from "@/components/common/button/IconButton";
import { useUser } from "@/components/feature/provider/UserProvider";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { LogoutButton } from "@/components/patterns/p-alert-dialog-13";

type Props = {
	profile: UserProfileType;
};

const numberFormatter = new Intl.NumberFormat("ja-JP");

export function UserProfileView({ profile }: Props) {
	const { user } = useUser();
	const canEdit = user?.id === profile.id;
	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [editedName, setEditedName] = useState(profile.name);
	const [editedBio, setEditedBio] = useState(profile.bio ?? "");

	useEffect(() => {
		setEditedName(profile.name);
		setEditedBio(profile.bio ?? "");
		setIsEditing(false);
	}, [profile.bio, profile.name]);

	return (
		<>
			<div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6">
				<section className="relative overflow-hidden bg-white">
					<div className="h-24 bg-[linear-gradient(135deg,#93c5fd_0%,#dbeafe_42%,#cffafe_100%)] sm:h-32" />
					{canEdit && (
						<div className="flex-1 absolute top-2 right-2">
							<IconButton
								variant="outline"
								icon={isEditing ? <Check /> : <Pencil />}
								rounded="full"
								enableClickAnimation
								className="transition-colors text-slate-500 hover:text-slate-700 hover:bg-black/10"
								onClick={() => {
									if (isEditing) {
										setIsConfirmOpen(true);
										return;
									}
									setIsEditing(true);
								}}
							>
								<span className="font-bold">{isEditing ? "完了" : "編集"}</span>
							</IconButton>
						</div>
					)}
					<div className="-mt-12 px-4 pb-6 sm:-mt-14 sm:px-6">
						<AuthorAvatar
							name={profile.name}
							image={profile.image}
							className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white"
							fallbackClassName="text-lg"
						/>
						<div className="space-y-4">
							<div className="mt-3 flex flex-col flex-wrap gap-x-3 gap-y-1">
								{isEditing ? (
									<input
										type="text"
										value={editedName}
										onChange={(event) => setEditedName(event.target.value)}
										maxLength={40}
										className="h-10 w-full max-w-md rounded-md border border-slate-300 bg-white px-3 text-xl font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 sm:text-2xl"
									/>
								) : (
									<h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
										{editedName}
									</h1>
								)}
								<span
									className="text-xs text-slate-400 sm:text-sm"
									title={profile.id}
								>
									@{profile.id}
								</span>
							</div>
							{isEditing ? (
								<div className="space-y-2">
									<textarea
										value={editedBio}
										onChange={(event) => setEditedBio(event.target.value)}
										maxLength={240}
										rows={4}
										placeholder="自己紹介を入力"
										className="w-full max-w-2xl rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
									/>
									<div className="flex items-center justify-between">
										<p className="text-xs text-slate-400">
											{editedBio.length}/240
										</p>
										<button
											type="button"
											className="text-xs text-slate-500 hover:text-slate-700"
											onClick={() => {
												setEditedName(profile.name);
												setEditedBio(profile.bio ?? "");
												setIsEditing(false);
											}}
										>
											キャンセル
										</button>
									</div>
								</div>
							) : (
								<p className="mt-2 text-sm text-slate-600">{editedBio}</p>
							)}
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
									<li
										key={post.id}
										className="rounded-lg bg-slate-50 px-3 py-2"
									>
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
			<LogoutButton
				isConfirmOpen={isConfirmOpen}
				setIsConfirmOpen={setIsConfirmOpen}
				setIsEditing={setIsEditing}
			/>
		</>
	);
}
