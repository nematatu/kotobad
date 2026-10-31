import { redirect } from "next/navigation";
import AuthForm from "@/components/feature/auth/AuthForm";

export default async function AuthPathPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	const { path } = await params;
	const normalizedPath = path.trim().toLowerCase();

	if (normalizedPath !== "sign-in" && normalizedPath !== "sign-up") {
		redirect("/auth/sign-in");
	}

	const isSignUp = normalizedPath === "sign-up";

	return (
		<main className="container flex min-h-[70vh] grow items-center justify-center p-4 md:p-6">
			<section className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
				<h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
					{isSignUp ? "アカウント登録" : "ログイン"}
				</h1>
				<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
					{isSignUp
						? "コトバドのアカウントを作成して参加しましょう。"
						: "アカウントにログインして続行できます。"}
				</p>
				<AuthForm isSignUp={isSignUp} />
			</section>
		</main>
	);
}
