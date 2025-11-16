"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye } from "react-icons/lu";
import { z } from "zod";
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
import { parseApiErrorMessage } from "@/lib/api/parseErrorMessage";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { BetterAuthSessionResponseSchema } from "@/lib/auth/betterAuthSession";

const LoginFormSchema = z.object({
	email: z.string().email("メールアドレスの形式が正しくありません"),
	password: z.string().min(1, "パスワードを入力してください"),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const LoginForm = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { setUser } = useUser();

	const form = useForm<LoginFormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
		resolver: zodResolver(LoginFormSchema),
	});

	const handleSubmit = async (values: LoginFormValues) => {
		setError(null);
		const baseUrl = await getBffApiUrl("LOGIN");

		try {
			const res = await fetch(baseUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
				credentials: "include",
			});

			if (!res.ok) {
				const errorBody = await res.json().catch(() => null);
				const message =
					parseApiErrorMessage(errorBody) ?? "ログインに失敗しました";
				setError(message);
				return;
			}

			const body = await res.json();
			const session = BetterAuthSessionResponseSchema.nullable().parse(body);

			if (!session) {
				setError("ログインに失敗しました");
				return;
			}

			setUser(session.user);
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
						name="email"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormLabel>メールアドレス</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type="email"
											placeholder="example@example.com"
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
												type={showPassword ? "text" : "password"}
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
						variant="secondary"
						type="submit"
					>
						ログイン
					</Button>
				</form>
			</Form>
		</div>
	);
};
