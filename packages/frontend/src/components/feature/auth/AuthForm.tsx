"use client";

import { useState } from "react";
import DemoLoginButton from "@/components/feature/button/auth/DemoLoginButton";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import { useDemoMode } from "@/lib/auth/demoMode";

type AuthFormProps = {
	isSignUp: boolean;
};

export default function AuthForm({ isSignUp }: AuthFormProps) {
	const { isDemo, setDemoMode } = useDemoMode();
	const [showGoogleAuth, setShowGoogleAuth] = useState(false);

	const isDemoActive = isDemo && !showGoogleAuth;

	return (
		<div className="mt-4 space-y-4">
			{isDemo && (
				<div className="rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
					<p className="font-semibold">デモモードが有効です</p>
					<p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
						{isSignUp
							? "デモモードではアカウント作成不要ですぐに参加できます。"
							: "ワンクリックでデモユーザーとしてログインし、すべての機能をお試しいただけます。"}
					</p>
				</div>
			)}

			<div className="flex flex-col items-center gap-3">
				{isDemoActive ? (
					<>
						<DemoLoginButton className="w-full" />
						<button
							type="button"
							onClick={() => setShowGoogleAuth(true)}
							className="text-xs text-slate-500 hover:text-slate-700 underline"
						>
							Googleアカウントでログインに切り替える
						</button>
					</>
				) : (
					<>
						<GoogleOAuth />
						<button
							type="button"
							onClick={() => {
								setDemoMode(true);
								setShowGoogleAuth(false);
							}}
							className="text-xs text-slate-400 hover:text-slate-600 underline"
						>
							デモアカウントで体験する
						</button>
					</>
				)}
			</div>
		</div>
	);
}
