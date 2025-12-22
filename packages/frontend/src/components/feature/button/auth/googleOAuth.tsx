"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import GoogleIcon from "@/assets/icons/google.svg";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export default function GoogleOAuth() {
	const [loading, setLoading] = useState(false);

	return (
		<div className="grid">
			<Button
				variant="google"
				className={cn("w-full")}
				disabled={loading}
				onClick={async () => {
					await signIn.social(
						{
							provider: "google",
							callbackURL: window.location.origin,
						},
						{
							onRequest: (_ctx) => {
								setLoading(true);
							},
							onResponse: (_ctx) => {
								setLoading(false);
							},
						},
					);
				}}
			>
				<GoogleIcon className="w-10 h-10" />
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
