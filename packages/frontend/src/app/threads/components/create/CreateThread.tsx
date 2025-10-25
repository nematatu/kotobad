import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
// import { useUser } from "@/components/feature/provider/UserProvider";
import { createThread } from "@/lib/api/threads";

type CreateThreadType = {
	title: string;
};

type CreateThreadFormProps = {
	onCreated: (newThread: ThreadType) => void;
};

export const CreateThreadForm = ({ onCreated }: CreateThreadFormProps) => {
	const [error, setError] = useState<string | null>(null);
	// const {user} = useUser()

	const form = useForm<CreateThreadType>({
		defaultValues: {
			title: "",
		},
	});

	const handleSubmit = async (values: CreateThreadType) => {
		setError(null);
		try {
			const res = await createThread(values);
			if ("id" in res) {
				onCreated(res);
				form.reset();
			} else {
				throw new Error(res.error);
			}
			console.log("新規スレッド作成", values);
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
		<Card className="my-4">
			<div className="w-[100%] p-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-3"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel className="text-md sm:text-xl">
										スレッドタイトル
									</FormLabel>
									<FormControl>
										{/* <Input */}
										{/* 	{...field} */}
										{/* 	{...form.register("title", { */}
										{/* 		required: "タイトルは必須です", */}
										{/* 	})} */}
										{/* 	placeholder="例: 〇〇の試合について" */}
										{/* 	className="w-full sm:h-14 sm:w-1/3 outline-2 focus:border-blue-600 placeholder-gray-500/50" */}
										{/* /> */}
										<Textarea
											{...field}
											{...form.register("title", {
												required: "タイトルは必須です",
												maxLength: {
													value: 80,
													message: "タイトルは80文字以内で入力してください",
												},
											})}
											placeholder="例: 〇〇の試合について"
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

						<div className="space-y-2">
							<div className="font-bold">ラベル</div>
						</div>

						<Button
							className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
							type="submit"
						>
							新規スレッド作成
						</Button>
					</form>
				</Form>
			</div>
		</Card>
	);
};

type CreateThreadProps = {
	onCreated: (newThread: ThreadType) => void;
};

export const CreateThread = ({ onCreated }: CreateThreadProps) => {
	const [isOpenForm, setIsOpenForm] = useState(false);
	const handleToggleForm = () => {
		setIsOpenForm((prev) => !prev);
	};

	return (
		<div>
			<Button
				className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
				type="button"
				onClick={handleToggleForm}
			>
				{isOpenForm ? "▲" : "▼"} スレッド作成
			</Button>

			{isOpenForm && <CreateThreadForm onCreated={onCreated} />}
		</div>
	);
};
