"use client";

import type { CreatePostType } from "@kotobad/shared/src/types/post";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import UserAvatar from "@/components/feature/user/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { cn } from "@/lib/utils";

type CreatePostFormProps = {
	threadId: number;
};

export const CreatePostForm = ({ threadId }: CreatePostFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isMinimized, setIsMinimized] = useState(false);
	const { mutate } = useSWRConfig();

	const form = useForm<CreatePostType>({
		defaultValues: {
			post: "",
			threadId: threadId,
		},
	});

	const handleSubmit = async (values: CreatePostType) => {
		try {
			const endpoint = await getBffApiUrl("CREATE_POST");
			await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			mutate(["GET_POSTS_BY_THREADID", threadId]);
			form.reset();
			toast.success("投稿しました!");
			setTimeout(() => form.setFocus("post"), 1);
		} catch (error: unknown) {
			if (
				typeof error === "object" &&
				error !== null &&
				"status" in error &&
				typeof (error as { status?: unknown }).status === "number" &&
				(error as { status: number }).status === 401
			) {
				setError("ログインが必要です");
				toast.error("ログインが必要です");
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
				toast.error(message);
			}
		}
	};

	return (
		<Card className="w-full">
			<div className="p-4">
				<div className="mb-4 relative flex items-center gap-2">
					<h1 className="text-md sm:text-xl font-bold">書き込み</h1>
					<button
						type="button"
						className="absolute left-1/2 -translate-x-1/2 p-1.5 transition cursor-pointer"
						onClick={() => setIsMinimized((prev) => !prev)}
						aria-expanded={!isMinimized}
						aria-label={
							isMinimized
								? "書き込みフォームを開く"
								: "書き込みフォームを最小化"
						}
					>
						<ChevronDown
							className={cn(
								"h-5 w-5 transition-transform",
								isMinimized ? "" : "rotate-180",
							)}
						/>
					</button>
				</div>
				<div
					className={cn(
						"overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
						isMinimized
							? "max-h-0 opacity-0 pointer-events-none"
							: "max-h-[600px] opacity-100",
					)}
					aria-hidden={isMinimized}
				>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-2"
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
															if (
																e.key === "Enter" &&
																(e.ctrlKey || e.metaKey)
															) {
																e.preventDefault();
																form.handleSubmit(handleSubmit)();
															}
														}}
														placeholder="内容"
														className="w-full border-none resize-none rounded-xl text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[84px]"
													/>

													<p className="hidden sm:block text-neutral-400 text-xs">
														Ctrl + Enter (Macの場合は ⌘ + Enter)で送信できます
													</p>
												</div>
											</FormControl>
											<FormMessage />
											{error && <p className="text-red-500 text-sm">{error}</p>}
										</div>
									</FormItem>
								)}
							/>
							<Button
								className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
								type="submit"
							>
								書き込む
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</Card>
	);
};
