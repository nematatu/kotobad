import { useState } from "react";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
// import { useUser } from "@/components/feature/provider/UserProvider";
import { createThread } from "@/lib/api/threads";
import { ThreadType } from "@b3s/shared/src/types";

type CreateThreadType = {
	title: string;
	// author: string;
	// content: string;
};

// CreateThreadForm.tsx
type Props = {
	onCreated: (newThread: ThreadType.ThreadType) => void;
};

export const CreateThreadForm = ({ onCreated }: Props) => {
	const [error, setError] = useState<string | null>(null);
	// const {user} = useUser()

	const form = useForm<CreateThreadType>({
		defaultValues: {
			title: "",
			// author: user ? user.username : "",
			// content: "",
		},
	});

	const handleSubmit = async (values: CreateThreadType) => {
		setError(null);
		try {
			const res = await createThread(values);
			if ("error" in res) throw new Error(res.error);
			//TODO エラーのステータスコードで表示するエラー文の分岐
			// TODO 分岐する文章をconstantsにまとめる
			// TODO コンポーネント分けする
			// TODO exciteのやつが使いやすかったからパクるのあり
			onCreated(res);
			console.log("新規スレッド作成", values);
		} catch (e: any) {
			if (e.status === 401) {
				setError("ログインが必要です");
			} else {
				setError(e.message);
			}
		}
	};

	return (
		<Card>
			<div className="w-[100%] p-4">
				<h1 className="mb-8 text-xl font-bold underline underline-offset-7">
					新規スレッド作成
				</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						{/* スレッドタイトル */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>スレッドタイトル</FormLabel>
									<FormControl>
										<Input
											{...field}
											{...form.register("title", {
												required: "タイトルは必須です",
											})}
											placeholder="例: 〇〇の試合について"
											className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
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
							className="my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
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
