"use client";
import { useState } from "react";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogHeader,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LuEye } from "react-icons/lu";
import Link from "next/link";
import { signup } from "@/lib/api/auth";
import type { LoginSignupUserType } from "@kotobad/shared/src/types/auth";

type SignupSchema = LoginSignupUserType & {
	confirmPassword: string;
};

export const SignupForm = () => {
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);
	const { isOpen, setIsOpen, setOpen } = useModal();
	const [registeredUsername, setRegisterdUsername] = useState<string>("");

	const form = useForm<SignupSchema>({
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onBlur",
	});

	const handleSubmit = async (values: SignupSchema) => {
		setError(null);

		try {
			const res = await signup(values);

			if (res && typeof res === "object" && "error" in res) {
				setError(typeof res.error === "string" ? res.error : "予期せぬエラー");
				return;
			}

			setRegisterdUsername(res.username);
			setOpen();
		} catch (e: any) {
			setError(e.message);
		}
	};

	return (
		<div className="w-[20%]">
			<h1 className="mb-8 text-xl font-bold underline underline-offset-7">
				新規登録フォーム
			</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormLabel>ユーザーネーム</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											{...form.register("username", {
												required: "ユーザー名は必須です",
											})}
											type="text"
											placeholder="ユーザーネーム"
											className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormLabel>パスワード</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											{...form.register("password", {
												required: "パスワードは必須です",
											})}
											type={showPassword == false ? "password" : "text"}
											placeholder="パスワード"
											className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
										/>
										<LuEye
											onClick={() => setShowPassword((prev) => !prev)}
											className="absolute right-0 top-1/2 -translate-1/2 cursor-pointer"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						rules={{
							required: "確認用パスワードは必須です",
							validate: (value, context) =>
								value === context.password || "パスワードが一致しません",
						}}
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showConfirmPassword ? "text" : "password"}
											placeholder="確認用パスワード"
											className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
										/>
										<LuEye
											onClick={() => setShowConfirmPassword((prev) => !prev)}
											className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{error && <p className="text-red-500">{error}</p>}
					<Button
						className="my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
						variant={"secondary"}
						type="submit"
					>
						登録
					</Button>
				</form>
			</Form>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					{/* <Button */}
					{/*     className="cursor-pointer bg-red-500 hover:bg-red-600" */}
					{/*     variant={"secondary"} */}
					{/*     onClick={() => { */}
					{/*         setOpen; */}
					{/*     }} */}
					{/* > */}
					{/*     モーダルテスト */}
					{/* </Button> */}
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-xl text-center">
							こんにちは、{registeredUsername}さん！
						</DialogTitle>
						<div>
							<DialogDescription>会員登録が完了しました！</DialogDescription>
							<Link href="login">
								<p className="text-blue-800 underline underline-offset-7">
									ログインページへ
								</p>
							</Link>
						</div>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button>close</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
