"use client";

import type { CreatePostType } from "@kotobad/shared/src/types/post";
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
	variant?: "default" | "inline";
};

import { Kbd } from "@/components/ui/kbd";

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

	const placeholder = isInline ? "返信を入力..." : "書き込み内容を入力...";
	const submitLabel = isInline ? "返信する" : "書き込む";

	const form = useForm<CreatePostType>({
		defaultValues: {
			post: "",
			imageUrls: [],
			threadId,
			replyToPostId: null,
		},
	});

	useEffect(() => {
		form.setValue("replyToPostId", replyTargetPostId);
		if (!isInline || replyTargetPostId === null) return;
		const timeoutId = window.setTimeout(() => form.setFocus("post"), 1);
		return () => window.clearTimeout(timeoutId);
	}, [form, isInline, replyTargetPostId]);

	const handleCancel = () => {
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

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex gap-3 items-start"
			>
				<div className="mt-1 shrink-0">
					<UserAvatar />
				</div>
				<div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-900">
					{replyTarget && (
						<div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-slate-950 border border-blue-50 px-3 py-1.5 text-[12px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
							<span>
								#{replyTarget.localId} {replyTarget.authorName}さんへの返信
							</span>
						</div>
					)}
					<FormField
						control={form.control}
						name="post"
						render={({ field }) => (
							<FormItem className="flex-1">
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
											"min-h-[38px] w-full resize-none border-none bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500",
										)}
									/>
								</FormControl>
								<FormMessage className="px-3 pb-1" />
								{error && <p className="text-sm text-red-500">{error}</p>}
							</FormItem>
						)}
					/>
					<>
						<ThreadPostImagePreviewGrid
							imagePreviewUrls={imagePreviewUrls}
							onRemoveImageAction={removeImageAtAction}
							disabled={isSubmitting}
						/>
						<div className="flex items-center justify-between border-t border-slate-100 px-1 pt-2 dark:border-slate-800">
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
								previewImageClassName="h-28"
								showIcons
								showPreview={false}
							/>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									rounded="full"
									onClick={handleCancel}
									disabled={
										isSubmitting || (!form.getValues("post") && !isInline)
									}
								>
									キャンセル
								</Button>
								<Button
									className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
									rounded="full"
									type="submit"
									disabled={form.getValues("post") === "" || isSubmitting}
								>
									{isSubmitting ? "送信中..." : submitLabel}

									<Kbd>⌘ + Enter</Kbd>
								</Button>
							</div>
						</div>
					</>
				</div>
			</form>
		</Form>
	);
};
