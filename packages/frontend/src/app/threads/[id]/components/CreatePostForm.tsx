"use client";

import type { CreatePostType } from "@kotobad/shared/src/types/post";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
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
	const { mutate } = useSWRConfig();
	const isInline = variant === "inline";
	const replyTargetPostId = replyTarget?.postId ?? null;

	const form = useForm<CreatePostType>({
		defaultValues: {
			post: "",
			threadId: threadId,
			replyToPostId: null,
		},
	});

	useEffect(() => {
		form.setValue("replyToPostId", replyTargetPostId);
		if (isInline && replyTargetPostId === null) return;
		const timeoutId = window.setTimeout(() => form.setFocus("post"), 1);
		return () => window.clearTimeout(timeoutId);
	}, [form, isInline, replyTargetPostId]);

	const handleSubmit = async (values: CreatePostType) => {
		try {
			const endpoint = await getBffApiUrl("CREATE_POST");
			const requestBody: CreatePostType =
				values.replyToPostId === null
					? {
							post: values.post,
							threadId: values.threadId,
						}
					: values;

			await BffFetcher(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			onPostedAction?.();
			mutate(["GET_POSTS_BY_THREADID", threadId]);
			form.reset({
				post: "",
				threadId,
				replyToPostId: null,
			});
			onClearReplyTargetAction?.();
			toast.success("投稿しました!");
			setTimeout(() => form.setFocus("post"), 1);
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				return;
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
				toast.error(message);
			}
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
						<FormItem className="flex gap-2">
							<UserAvatar />
							<div className="flex min-w-0 flex-1 flex-col space-y-2">
								<FormControl>
									<div>
										<Textarea
											{...field}
											{...form.register("post", {
												required: "空文字は送信できません",
												maxLength: {
													value: 80,
													message: "80文字以内で入力してください",
												},
											})}
											onKeyDown={(e) => {
												if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
													e.preventDefault();
													form.handleSubmit(handleSubmit)();
												}
											}}
											placeholder={isInline ? "返信を追加..." : "内容"}
											className={`w-full border-none resize-none rounded-xl text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 ${
												isInline ? "min-h-[72px]" : "sm:min-h-[84px]"
											}`}
										/>
									</div>
								</FormControl>
								<FormMessage />
								{error && <p className="text-red-500 text-sm">{error}</p>}
							</div>
						</FormItem>
					)}
				/>
				<div className="flex items-end justify-end gap-2">
					{isInline ? (
						<Button
							type="button"
							variant="outline"
							rounded="full"
							onClick={onClearReplyTargetAction}
						>
							キャンセル
						</Button>
					) : (
						<p className="hidden sm:block text-neutral-400 text-xs">
							Ctrl + Enter (Macの場合は ⌘ + Enter)で送信できます
						</p>
					)}
					<Button
						className="text-white cursor-pointer bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
						rounded="full"
						type="submit"
					>
						{isInline ? "返信する" : "書き込む"}
					</Button>
				</div>
			</form>
		</Form>
	);

	if (isInline) {
		return (
			<div className="rounded-xl border border-slate-200 bg-white p-3">
				{formView}
			</div>
		);
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
