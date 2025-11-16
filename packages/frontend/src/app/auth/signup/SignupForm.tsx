"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye } from "react-icons/lu";
import { z } from "zod";
import { useUser } from "@/components/feature/provider/UserProvider";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import { parseApiErrorMessage } from "@/lib/api/parseErrorMessage";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { BetterAuthSessionResponseSchema } from "@/lib/auth/betterAuthSession";

const SignupFormSchema = z
	.object({
		name: z.string().min(1, "名前は必須です"),
		email: z.string().email("メールアドレスの形式が正しくありません"),
		password: z.string().min(8, "8文字以上のパスワードを設定してください"),
		confirmPassword: z.string().min(8, "確認用パスワードを入力してください"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "パスワードが一致しません",
		path: ["confirmPassword"],
	});

type SignupFormValues = z.infer<typeof SignupFormSchema>;

export const SignupForm = () => {
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);
	const { isOpen, setIsOpen, setOpen } = useModal();
	const [registeredName, setRegisteredName] = useState<string>("");
	const { setUser } = useUser();

	const form = useForm<SignupFormValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onBlur",
		resolver: zodResolver(SignupFormSchema),
	});

	const handleSubmit = async (values: SignupFormValues) => {
		setError(null);
		const baseUrl = await getBffApiUrl("SIGN_UP");

		try {
			const res = await fetch(baseUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					password: values.password,
				}),
				credentials: "include",
			});

			if (!res.ok) {
				const errorBody = await res.json().catch(() => null);
				const message = parseApiErrorMessage(errorBody) ?? "登録に失敗しました";
				setError(message);
				return;
			}

			const body = await res.json();
			const session = BetterAuthSessionResponseSchema.nullable().parse(body);

			if (!session) {
				setError("登録に失敗しました");
				return;
			}

			setUser(session.user);
			setRegisteredName(session.user.name ?? session.user.email);
			setOpen();
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "登録に失敗しました";
			setError(message);
		}
	};

	return (
		<div className="w-[70%] md:w-[20%]">
			<h1 className="mb-8 text-xl font-bold underline underline-offset-7">
				新規登録フォーム
			</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormLabel>表示名</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="Kotobad 太郎"
										className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormLabel>メールアドレス</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="email"
										placeholder="example@example.com"
										className="outline-2 focus:border-blue-600 placeholder-gray-500/50"
									/>
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
											type={showPassword ? "text" : "password"}
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
						render={({ field }) => (
							<FormItem className="flex flex-col gap-2">
								<FormLabel>確認用パスワード</FormLabel>
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
						variant="secondary"
						type="submit"
					>
						登録
					</Button>
				</form>
			</Form>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-xl text-center">
							こんにちは、{registeredName}さん！
						</DialogTitle>
						<div>
							<DialogDescription>会員登録が完了しました！</DialogDescription>
							<Link href="/">
								<p className="text-blue-800 underline underline-offset-7">
									トップページへ
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
