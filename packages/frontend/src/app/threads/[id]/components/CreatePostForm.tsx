import type { CreatePostType } from "@kotobad/shared/src/types/post";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

type CreatePostFormProps = {
	threadId: number;
	onSuccess?: () => void;
};

export const CreatePostForm = ({
	threadId,
	onSuccess,
}: CreatePostFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const form = useForm<CreatePostType>({
		defaultValues: {
			post: "",
			threadId: threadId,
		},
	});

	const handleSubmit = async (values: CreatePostType) => {
		try {
			const endpoint = await getBffApiUrl("CREATE_POST");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const body = await response.json();
			if (onSuccess) onSuccess();

			form.reset();
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
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
			}
		}
	};

	return (
		<Card className="my-4 w-full sm:w-1/2">
			<div className="p-4">
				<h1 className="mb-4 text-md sm:text-xl font-bold mb-6">書き込み</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-2"
					>
						<FormField
							control={form.control}
							name="post"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormControl>
										<Textarea
											{...field}
											{...form.register("post", {
												required: "空文字は送信できません",
												maxLength: {
													value: 80,
													message: "80文字以内で入力してください",
												},
											})}
											placeholder="内容"
											className="w-full sm:h-14 sm:w-1/3 outline-2 focus:border-blue-600 placeholder-gray-500/50"
											onKeyDown={(e) => {
												if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
													e.preventDefault();
													form.handleSubmit(handleSubmit)();
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<p className="hidden sm:block text-neutral-400 font-sm">
							Ctrl + Enter (Macの場合は ⌘ + Enter)で送信できます
						</p>
						{error && <p className="text-red-500">{error}</p>}
						<Button
							className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
							type="submit"
						>
							書き込む
						</Button>
					</form>
				</Form>
			</div>
		</Card>
	);
};
