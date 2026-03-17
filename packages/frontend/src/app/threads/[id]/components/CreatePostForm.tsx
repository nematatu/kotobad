"use client";

import type { CreatePostType } from "@kotobad/shared/src/types/post";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import IconButton from "@/components/common/button/IconButton";
import UserAvatar from "@/components/feature/user/UserAvatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { cn } from "@/lib/utils";
import {
	ThreadPostImagePicker,
	ThreadPostImagePreviewGrid,
} from "../../components/shared/ThreadPostImagePicker";
import { useThreadPostImageInput } from "../../lib/useThreadPostImageInput";
import type { ReplyTarget } from "./types/replyTarget";

type CreatePostFormProps = {
	threadId: number;
	replyTarget?: ReplyTarget | null;
	onPostedAction?: () => void;
	onClearReplyTargetAction?: () => void;
	variant?: "default" | "inline" | "chat" | "bottomNav";
};

export const CreatePostForm = ({
	threadId,
	replyTarget = null,
	onPostedAction,
	onClearReplyTargetAction,
	variant = "default",
}: CreatePostFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const submitLockRef = useRef(false);
	const {
		imagePreviewUrls,
		maxImages,
		imageInputRef,
		selectImageAction,
		openImageDialogAction,
		clearImageSelectionAction,
		removeImageAtAction,
		uploadSelectedImagesAction,
	} = useThreadPostImageInput({ maxImages: 1 });
	const { mutate } = useSWRConfig();
	const isInline = variant === "inline";
	const isChat = variant === "chat";
	const isBottomNav = variant === "bottomNav";
	const isThreadLike = !isChat;
	const replyTargetPostId = replyTarget?.postId ?? null;

	const form = useForm<CreatePostType>({
		defaultValues: {
			post: "",
			imageUrls: [],
			threadId: threadId,
			replyToPostId: null,
		},
	});

	useEffect(() => {
		form.setValue("replyToPostId", replyTargetPostId);
		if (!isInline || replyTargetPostId === null) return;
		const timeoutId = window.setTimeout(() => form.setFocus("post"), 1);
		return () => window.clearTimeout(timeoutId);
	}, [form, isInline, replyTargetPostId]);

	const handleSubmit = async (values: CreatePostType) => {
		if (submitLockRef.current) {
			return;
		}
		submitLockRef.current = true;
		setIsSubmitting(true);
		setError(null);

		try {
			const imageUrls = await uploadSelectedImagesAction("post");
			const endpoint = await getBffApiUrl("CREATE_POST");
			const requestBody: CreatePostType =
				values.replyToPostId === null
					? {
							post: values.post,
							imageUrls,
							threadId: values.threadId,
						}
					: {
							...values,
							imageUrls,
						};

			await BffFetcher(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			onPostedAction?.();
			mutate(["GET_POSTS_BY_THREADID", threadId]);
			form.reset({
				post: "",
				imageUrls: [],
				threadId,
				replyToPostId: null,
			});
			clearImageSelectionAction();
			onClearReplyTargetAction?.();
			toast.success("投稿しました!");
			setTimeout(() => form.setFocus("post"), 1);
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				return;
			}
			if (fetchError.status === 429) {
				const message =
					"投稿間隔が短すぎます。少し待ってから再送してください。";
				setError(message);
				toast.error(message);
				return;
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
				toast.error(message);
			}
		} finally {
			submitLockRef.current = false;
			setIsSubmitting(false);
		}
	};

	const formView = (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex flex-col space-y-2"
			>
				<FormField
					control={form.control}
					name="post"
					render={({ field }) => (
						<FormItem
							className={cn("flex gap-2", isChat ? "items-center" : undefined)}
						>
							{isChat ? null : <UserAvatar />}
							<div className="flex min-w-0 flex-1 flex-col space-y-2">
								<FormControl>
									<div>
										<Textarea
											rows={1}
											{...field}
											{...form.register("post", {
												required: "空文字は送信できません",
												maxLength: {
													value: 80,
													message: "80文字以内で入力してください",
												},
											})}
											autoFocus={isInline && replyTargetPostId !== null}
											disabled={isSubmitting}
											onInput={(event) => {
												const element = event.currentTarget;
												element.style.height = "0px";
												element.style.height = `${element.scrollHeight}px`;
											}}
											onKeyDown={(e) => {
												if (isSubmitting) {
													return;
												}
												if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
													e.preventDefault();
													void form.handleSubmit(handleSubmit)();
												}
											}}
											placeholder={
												isInline
													? "返信を追加..."
													: isChat
														? "メッセージを入力..."
														: "内容"
											}
											className={cn(
												"w-full resize-none rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0",
												isChat
													? "min-h-[48px] bg-[#ffffff]/95 px-3 py-2 text-base shadow-none dark:bg-[#101b2c] sm:text-sm"
													: "min-h-10 overflow-hidden border-none py-2 text-slate-900 shadow-none placeholder:text-slate-400 dark:text-[#e5e7eb] dark:placeholder:text-[#94a3b8]",
												isChat ? "max-h-32" : undefined,
											)}
										/>
									</div>
								</FormControl>
								<FormMessage />
								{error && <p className="text-red-500 text-sm">{error}</p>}
								{isThreadLike && (
									<ThreadPostImagePreviewGrid
										imagePreviewUrls={imagePreviewUrls}
										onRemoveImageAction={removeImageAtAction}
										disabled={isSubmitting}
									/>
								)}
							</div>
						</FormItem>
					)}
				/>
				<ThreadPostImagePicker
					imageInputRef={imageInputRef}
					imagePreviewUrls={imagePreviewUrls}
					maxImages={maxImages}
					disabled={isSubmitting}
					onSelectImageAction={selectImageAction}
					onOpenImageDialogAction={openImageDialogAction}
					onClearImageAction={clearImageSelectionAction}
					onRemoveImageAction={removeImageAtAction}
					actionsClassName={isChat ? "pl-0" : "pl-10"}
					previewImageClassName="h-28"
					showIcons
					showPreview={isChat}
				/>
				<div className="flex items-center justify-end gap-2">
					{isInline ? (
						<Button
							type="button"
							variant="outline"
							rounded="full"
							onClick={onClearReplyTargetAction}
							disabled={isSubmitting}
						>
							キャンセル
						</Button>
					) : isChat ? null : (
						<p className="hidden sm:block text-neutral-400 text-xs">
							Ctrl + Enter (Macの場合は ⌘ + Enter)で送信できます
						</p>
					)}
					<Button
						className={cn(
							"cursor-pointer focus:outline-none focus:ring-1 focus:ring-offset-2",
							isChat
								? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400"
								: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
						)}
						rounded={isChat ? "md" : "full"}
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting
							? "送信中..."
							: isInline
								? "返信する"
								: isChat
									? "送信"
									: "書き込む"}
					</Button>
				</div>
			</form>
		</Form>
	);

	const bottomNavFormView = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1.5">
				<ThreadPostImagePreviewGrid
					imagePreviewUrls={imagePreviewUrls}
					onRemoveImageAction={removeImageAtAction}
					disabled={isSubmitting}
				/>
				<div className="flex items-center gap-1.5">
					<ThreadPostImagePicker
						imageInputRef={imageInputRef}
						imagePreviewUrls={imagePreviewUrls}
						maxImages={maxImages}
						disabled={isSubmitting}
						onSelectImageAction={selectImageAction}
						onOpenImageDialogAction={openImageDialogAction}
						onClearImageAction={clearImageSelectionAction}
						onRemoveImageAction={removeImageAtAction}
						actionsClassName="shrink-0"
						showPreview={false}
					/>
					<div className="min-w-0 flex-1">
						<FormField
							control={form.control}
							name="post"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											rows={1}
											{...field}
											{...form.register("post", {
												required: "空文字は送信できません",
												maxLength: {
													value: 80,
													message: "80文字以内で入力してください",
												},
											})}
											disabled={isSubmitting}
											onInput={(event) => {
												const element = event.currentTarget;
												element.style.height = "0px";
												element.style.height = `${element.scrollHeight}px`;
											}}
											onKeyDown={(e) => {
												if (isSubmitting) {
													return;
												}
												if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
													e.preventDefault();
													void form.handleSubmit(handleSubmit)();
												}
											}}
											placeholder="返信を入力..."
											className="max-h-24 min-h-9 w-full overflow-hidden rounded-lg border-none bg-white/90 px-2 py-2 text-base text-[#111827] shadow-none placeholder:text-[#6b7280] focus-visible:ring-0 focus-visible:ring-offset-0 md:text-sm dark:bg-[#101b2c] dark:text-[#e5e7eb] dark:placeholder:text-[#94a3b8]"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<Button
						className="h-9 shrink-0 bg-blue-500 px-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
						rounded="full"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "送信中" : "送信"}
					</Button>
				</div>
				{error && <p className="text-xs text-red-500">{error}</p>}
			</form>
		</Form>
	);

	if (isInline) {
		return (
			<div className="rounded-xl bg-white p-3 dark:bg-[#0f172a]">
				{formView}
			</div>
		);
	}

	if (isChat) {
		return <div className="w-full">{formView}</div>;
	}

	if (isBottomNav) {
		return <div className="w-full">{bottomNavFormView}</div>;
	}

	return (
		<div className="rounded-lg bg-white w-full">
			<div className="p-4">
				<div className="mb-4 relative flex items-center gap-2">
					<h1 className="text-md sm:text-xl font-bold">書き込み</h1>
				</div>
				{replyTarget && (
					<div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-slate-100 p-1 text-xs text-slate-800">
						<span>
							#{replyTarget.localId} {replyTarget.authorName}に返信
						</span>
						<IconButton
							onClick={onClearReplyTargetAction}
							enableClickAnimation
							variant="ghost"
							icon={<X />}
							className="!p-0"
						/>
					</div>
				)}
				<div className="overflow-hidden transition-[max-height,opacity] duration-200 ease-out max-h-[600px]">
					{formView}
				</div>
			</div>
		</div>
	);
};
