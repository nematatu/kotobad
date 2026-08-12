"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import GoogleIcon from "@/assets/icons/google.svg";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export default function GoogleOAuth() {
	const [loading, setLoading] = useState(false);

	const handleSignIn = async () => {
		if (loading) return;

		setLoading(true);
		try {
			const result = await signIn.social({
				provider: "google",
				callbackURL: window.location.origin,
			});

			if (result.error) {
				console.error("Google sign-in failed", result.error);
				toast.error(
					"Googleログインを開始できませんでした。再度お試しください。",
				);
			}
		} catch (error: unknown) {
			console.error("Google sign-in failed", error);
			toast.error("Googleログインを開始できませんでした。再度お試しください。");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="grid min-w-[8.75rem]">
			<Button
				type="button"
				variant="google"
				className={cn("w-full")}
				disabled={loading}
				aria-label={loading ? "Googleログインを開始しています" : undefined}
				onClick={handleSignIn}
			>
				<GoogleIcon className="h-4 w-4" />
				<div className="relative flex w-full justify-center">
					<p
						className={cn(
							"w-full text-center text-xs font-bold",
							loading && "text-transparent",
						)}
					>
						Google でログイン
					</p>
					{loading && (
						<span className="absolute inset-0 flex items-center justify-center">
							<Loader2 size={16} className="animate-spin" />
						</span>
					)}
				</div>
			</Button>
		</div>
	);
}
