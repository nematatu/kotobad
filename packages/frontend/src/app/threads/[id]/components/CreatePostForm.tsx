"use client";

import type { CreatePostType } from "@kotobad/shared/src/types/post";
import { ImagePlus, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
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
import { ThreadPostImagePreviewGrid } from "../../components/shared/ThreadPostImagePicker";
import { useThreadPostImageInput } from "../../lib/useThreadPostImageInput";
import type { ReplyTarget } from "./types/replyTarget";

type CreatePostFormProps = {
	threadId: number;
	replyTarget?: ReplyTarget | null;
	onPostedAction?: () => void;
	onClearReplyTargetAction?: () => void;
	variant?: "default" | "inline";
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
	const replyTargetPostId = replyTarget?.postId ?? null;

	const form = useForm<CreatePostType>({
		defaultValues: {
			post: "",
			imageUrls: [],
			threadId,
			replyToPostId: null,
		},
	});
	const postValue = form.watch("post");
	const isSubmitDisabled = postValue.trim().length === 0 || isSubmitting;
	const placeholder = "チャット...";

	useEffect(() => {
		form.setValue("replyToPostId", replyTargetPostId);
		if (!isInline || replyTargetPostId === null) return;
		const timeoutId = window.setTimeout(() => form.setFocus("post"), 1);
		return () => window.clearTimeout(timeoutId);
	}, [form, isInline, replyTargetPostId]);

	const handleSubmit = async (values: CreatePostType) => {
		if (submitLockRef.current) return;
		submitLockRef.current = true;
		setIsSubmitting(true);
		setError(null);
		try {
			const imageUrls = await uploadSelectedImagesAction("post");
			const endpoint = await getBffApiUrl("CREATE_POST");

			const requestBody: CreatePostType =
				values.replyToPostId === null
					? { post: values.post, imageUrls, threadId: values.threadId }
					: { ...values, imageUrls };

			await BffFetcher(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			onPostedAction?.();
			mutate(["GET_POSTS_BY_THREADID", threadId]);
			form.reset({ post: "", imageUrls: [], threadId, replyToPostId: null });
			clearImageSelectionAction();
			onClearReplyTargetAction?.();
			toast.success("投稿しました!");
			setTimeout(() => form.setFocus("post"), 1);
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) return;
			if (fetchError.status === 429) {
				const message =
					"投稿間隔が短すぎます。少し待ってから再送してください。";
				setError(message);
				toast.error(message);
				return;
			}
			const message =
				error instanceof Error ? error.message : "不明なエラーが発生しました";
			setError(message);
			toast.error(message);
		} finally {
			submitLockRef.current = false;
			setIsSubmitting(false);
		}
	};

	const handleInlineCancel = () => {
		form.reset({
			post: "",
			imageUrls: [],
			threadId,
			replyToPostId: null,
		});
		clearImageSelectionAction();
		setError(null);
		onClearReplyTargetAction?.();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className={cn("w-full", !isInline && "flex items-start gap-2")}
			>
				<div
					className={cn(
						"min-w-0 w-full rounded-2xl border border-slate-200 bg-gray-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900",
						!isInline && "flex-1 rounded-full",
					)}
				>
					{(replyTarget || isInline) && (
						<div className="mb-2 flex items-center justify-between gap-2">
							{replyTarget ? (
								<div className="inline-flex items-center rounded-full border border-blue-50 bg-blue-100 px-3 py-1.5 text-[12px] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
									<span>
										#{replyTarget.localId} {replyTarget.authorName}さんへの返信
									</span>
								</div>
							) : (
								<span />
							)}
							{isInline && (
								<Button
									type="button"
									variant="ghost"
									className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
									onClick={handleInlineCancel}
									disabled={isSubmitting}
									aria-label="返信フォームを閉じる"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					)}
					<input
						ref={imageInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/avif"
						disabled={isSubmitting || imagePreviewUrls.length >= maxImages}
						onChange={selectImageAction}
						className="hidden"
					/>
					<div className="flex items-center gap-2">
						{!isInline && (
							<div className="mt-0.5 shrink-0">
								<UserAvatar />
							</div>
						)}
						<div className="shrink-0">
							<Button
								type="button"
								variant="ghost"
								className="h-9 w-9 p-0"
								onClick={openImageDialogAction}
								disabled={isSubmitting || imagePreviewUrls.length >= maxImages}
								aria-label="画像を追加"
							>
								<ImagePlus className="h-4 w-4" />
							</Button>
						</div>
						<FormField
							control={form.control}
							name="post"
							render={({ field }) => (
								<FormItem className="min-w-0 flex-1">
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
											autoFocus={isInline && replyTargetPostId !== null}
											disabled={isSubmitting}
											onInput={(e) => {
												const el = e.currentTarget;
												el.style.height = "0px";
												el.style.height = `${el.scrollHeight}px`;
											}}
											onKeyDown={(e) => {
												if (isSubmitting) return;
												if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
													e.preventDefault();
													void form.handleSubmit(handleSubmit)();
												}
											}}
											placeholder={placeholder}
											className={cn(
												"min-h-[34px] w-full resize-none border-none bg-transparent px-1 py-1.5 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500",
											)}
										/>
									</FormControl>
									<FormMessage className="px-1" />
								</FormItem>
							)}
						/>
						<div className="shrink-0">
							<Button
								className="h-9 w-9 cursor-pointer rounded-full bg-blue-500 p-0 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
								type="submit"
								disabled={isSubmitDisabled}
								aria-label={isSubmitting ? "送信中" : "書き込む"}
							>
								<SendHorizontal className="h-4 w-4" />
							</Button>
						</div>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
					{imagePreviewUrls.length > 0 && (
						<div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
							<ThreadPostImagePreviewGrid
								imagePreviewUrls={imagePreviewUrls}
								onRemoveImageAction={removeImageAtAction}
								disabled={isSubmitting}
							/>
						</div>
					)}
				</div>
			</form>
		</Form>
	);
};
