import {
	Form,
	FormItem,
	FormControl,
	FormMessage,
	FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { createPost } from "@/lib/api/posts";
import type { CreatePostType } from "@b3s/shared/src/types/post";
import { useState } from "react";

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
		console.log("values", values);
		try {
			await createPost(values);
			if (onSuccess) onSuccess();
			form.reset();
		} catch (e: any) {
			if (e.status === 401) {
				setError("ログインが必要です");
			} else {
				setError(e.message);
			}
		}
	};

	return (
		<Card className="my-4 sm:w-1/2">
			<div className="w-[100%] p-4">
				<h1 className="mb-4 text-md sm:text-xl font-bold ">書き込み</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
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
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* 名前 */}
						{/* <FormField */}
						{/* 	control={form.control} */}
						{/* 	name="author" */}
						{/* 	render={({ field }) => ( */}
						{/* 		<FormItem className="flex flex-col gap-2"> */}
						{/* 			<FormLabel>名前</FormLabel> */}
						{/* 			<FormControl> */}
						{/* 				<Input */}
						{/* 					{...field} */}
						{/* 					{...form.register("author", { */}
						{/* 						required: "名前は必須です", */}
						{/* 					})} */}
						{/* 					placeholder="例: 山田太郎" */}
						{/* 					className="outline-2 focus:border-blue-600 placeholder-gray-500/50" */}
						{/* 				/> */}
						{/* 			</FormControl> */}
						{/* 			<FormMessage /> */}
						{/* 		</FormItem> */}
						{/* 	)} */}
						{/* /> */}

						{/* 本文 */}
						{/* <FormField */}
						{/* 	control={form.control} */}
						{/* 	name="content" */}
						{/* 	render={({ field }) => ( */}
						{/* 		<FormItem className="flex flex-col gap-2"> */}
						{/* 			<FormLabel>本文</FormLabel> */}
						{/* 			<FormControl> */}
						{/* 				<Textarea */}
						{/* 					{...field} */}
						{/* 					{...form.register("content", { */}
						{/* 						required: "本文は必須です", */}
						{/* 					})} */}
						{/* 					placeholder="ここに本文を入力してください" */}
						{/* 					className="min-h-[120px] outline-2 focus:border-blue-600 placeholder-gray-500/50" */}
						{/* 				/> */}
						{/* 			</FormControl> */}
						{/* 			<FormMessage /> */}
						{/* 		</FormItem> */}
						{/* 	)} */}
						{/* /> */}

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
