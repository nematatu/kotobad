"use client";
import type { LoginSignupUserType } from "@kotobad/shared/src/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye } from "react-icons/lu";
import { useUser } from "@/components/feature/provider/UserProvider";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getMe, login } from "@/lib/api/auth";

export const LoginForm = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { setUser } = useUser();

	const form = useForm<LoginSignupUserType>({
		defaultValues: {
			username: "",
			password: "",
		},
		mode: "onBlur",
	});

	const handleSubmit = async (values: LoginSignupUserType) => {
		setError(null);

		try {
			await login(values);
			const me = await getMe();
			if ("error" in me) {
				const errorMsg =
					typeof me.error === "string" ? me.error : String(me.error);
				setError(errorMsg);
				return;
			}
			setUser(me);
			router.push("/");
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "ログインに失敗しました";
			setError(message);
		}
	};

	return (
		<div className="w-[70%] md:w-[20%]">
			<h1 className="mb-8 text-xl font-bold underline underline-offset-7">
				ログインフォーム
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
									<div className="flex-col space-y-5">
										<div className="relative">
											<Input
												{...field}
												{...form.register("password", {
													required: "パスワードは必須です",
													validate: (value) =>
														value === form.getValues("password") ||
														"パスワードが一致しません",
												})}
												type={showPassword === false ? "password" : "text"}
												placeholder="パスワード"
												className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
											/>
											<LuEye
												onClick={() => setShowPassword((prev) => !prev)}
												className="absolute right-0 top-1/2 -translate-1/2 cursor-pointer"
											/>
										</div>
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
		</div>
	);
};
