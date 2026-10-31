"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DemoLoginButtonProps = {
	className?: string;
	onSuccess?: () => void;
};

export default function DemoLoginButton({
	className,
	onSuccess,
}: DemoLoginButtonProps) {
	const [loading, setLoading] = useState(false);

	const handleDemoSignIn = async () => {
		if (loading) return;

		setLoading(true);
		try {
			const res = await fetch("/auth/api/demo-login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as {
					error?: string;
				};
				console.error("Demo sign-in failed", data);
				toast.error("デモログインを開始できませんでした。再度お試しください。");
				return;
			}

			toast.success("デモユーザーとしてログインしました！");
			if (onSuccess) {
				onSuccess();
			} else {
				window.location.reload();
			}
		} catch (error: unknown) {
			console.error("Demo sign-in failed", error);
			toast.error("デモログインを開始できませんでした。再度お試しください。");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("grid min-w-[8.75rem]", className)}>
			<Button
				type="button"
				className={cn(
					"w-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all duration-200",
					className,
				)}
				disabled={loading}
				aria-label={
					loading ? "デモログインを開始しています" : "デモユーザーでログイン"
				}
				onClick={handleDemoSignIn}
			>
				<Sparkles className="h-4 w-4 shrink-0 text-emerald-100" />
				<div className="relative flex w-full justify-center">
					<p
						className={cn(
							"w-full text-center text-xs font-bold tracking-tight",
							loading && "text-transparent",
						)}
					>
						デモユーザーでログイン
					</p>
					{loading && (
						<span className="absolute inset-0 flex items-center justify-center">
							<Loader2 size={16} className="animate-spin text-white" />
						</span>
					)}
				</div>
			</Button>
		</div>
	);
}
