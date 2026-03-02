"use client";

import { UploadAvatarResponseSchema } from "@kotobad/shared/src/schemas/user";
import type { UserProfileType } from "@kotobad/shared/src/types/user";
import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import { Camera, Check, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import IconButton from "@/components/common/button/IconButton";
import { useUser } from "@/components/feature/provider/UserProvider";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";

type Props = {
	profile: UserProfileType;
};

const numberFormatter = new Intl.NumberFormat("ja-JP");

export function UserProfileView({ profile }: Props) {
	const { user, setUser } = useUser();
	const isLogin = user?.id === profile.id;
	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [editedName, setEditedName] = useState(profile.name);
	const [editedBio, setEditedBio] = useState(profile.bio ?? "");
	const [avatarImage, setAvatarImage] = useState<string | null>(
		profile.image ?? null,
	);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setEditedName(profile.name);
		setEditedBio(profile.bio ?? "");
		setIsEditing(false);
	}, [profile.bio, profile.name]);

	useEffect(() => {
		setAvatarImage(profile.image ?? null);
	}, [profile.image]);

	const openAvatarFileDialog = () => {
		if (!isEditing || isUploadingAvatar) return;
		avatarInputRef.current?.click();
	};

	const handleAvatarFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (file.size <= 0) {
			toast.error("ファイルが空です");
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			toast.error("2MB以下の画像を選択してください");
			return;
		}

		setIsUploadingAvatar(true);
		try {
			const endpoint = await getBffApiUrl("UPLOAD_MY_AVATAR");
			const formData = new FormData();
			formData.append("file", file);
			const raw = await BffFetcher<unknown>(endpoint, {
				method: "POST",
				body: formData,
			});
			const response = UploadAvatarResponseSchema.parse(raw);
			setAvatarImage(response.imageUrl);

			if (user) {
				setUser({
					...user,
					image: response.imageUrl,
				});
			}
			toast.success("アイコン画像を更新しました");
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.body) {
				try {
					const parsed = JSON.parse(fetchError.body) as {
						error?: string;
						message?: string;
					};
					toast.error(parsed.message ?? parsed.error ?? "更新に失敗しました");
					return;
				} catch {
					// no-op
				}
			}
			toast.error("アイコン画像の更新に失敗しました");
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	return (
		<>
			<div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6">
				<section className="relative overflow-hidden bg-white">
					<div className="h-24 bg-[linear-gradient(135deg,#93c5fd_0%,#dbeafe_42%,#cffafe_100%)] sm:h-32" />
					{isLogin && (
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
						<div className="relative inline-flex group">
							<AuthorAvatar
								name={profile.name}
								image={avatarImage}
								className=" h-24 w-24 sm:h-28 sm:w-28 border-4 border-white"
								fallbackClassName="text-lg"
							/>
							{isLogin && isEditing && (
								<button
									type="button"
									className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-white bg-black/30 text-white transition-colors hover:bg-black/25 cursor-pointer"
									onClick={openAvatarFileDialog}
									disabled={isUploadingAvatar}
									aria-label="アイコン画像を変更"
								>
									{isUploadingAvatar ? (
										<Loader2 className="h-5 w-5 animate-spin" />
									) : (
										<Camera className="h-5 w-5" />
									)}
								</button>
							)}
							<input
								ref={avatarInputRef}
								type="file"
								accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
								className="hidden"
								onChange={handleAvatarFileChange}
							/>
						</div>
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
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
					<div className="flex flex-col items-center justify-center gap-2 p-8 mb-2">
						<div className="rounded-full size-12 flex items-center justify-center">
							<Pencil className="size-6" />
						</div>
						<AlertDialogHeader>
							<AlertDialogTitle className="text-center text-base font-semibold">
								プロフィールを更新しますか？
							</AlertDialogTitle>
							<AlertDialogDescription className="p-0 text-center text-sm text-slate-500">
								現在の編集内容でプロフィールを更新します。
							</AlertDialogDescription>
						</AlertDialogHeader>
					</div>
					<AlertDialogFooter className="grid flex-none grid-cols-2 gap-0 border-t pt-0">
						<AlertDialogCancel className="border-border h-12 flex-1 rounded-none border-0 border-r p-0">
							戻る
						</AlertDialogCancel>
						<AlertDialogAction
							className="h-12 flex-1 rounded-none border-0 p-0"
							onClick={() => {
								setIsEditing(false);
								setIsConfirmOpen(false);
							}}
						>
							更新する
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
