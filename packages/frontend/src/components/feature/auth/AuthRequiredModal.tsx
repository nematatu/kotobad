"use client";

import { useEffect, useState } from "react";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import { useUser } from "@/components/feature/provider/UserProvider";
import { AUTH_REQUIRED_EVENT } from "@/lib/auth/authRequiredEvent";

const EXIT_ANIMATION_MS = 180;

export default function AuthRequiredModal() {
	const { user, isLoading } = useUser();
	const [visible, setVisible] = useState(false);
	const [isRendered, setIsRendered] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const onAuthRequired = () => {
			setVisible(true);
		};
		window.addEventListener(AUTH_REQUIRED_EVENT, onAuthRequired);
		return () => {
			window.removeEventListener(AUTH_REQUIRED_EVENT, onAuthRequired);
		};
	}, []);

	useEffect(() => {
		if (user) {
			setVisible(false);
		}
	}, [user]);

	useEffect(() => {
		let frameId: number | undefined;
		if (visible && !isLoading && !user) {
			setIsRendered(true);
			frameId = window.requestAnimationFrame(() => {
				setIsOpen(true);
			});
		} else {
			setIsOpen(false);
		}
		return () => {
			if (frameId !== undefined) {
				window.cancelAnimationFrame(frameId);
			}
		};
	}, [visible, isLoading, user]);

	useEffect(() => {
		if (!isOpen && isRendered) {
			const timer = window.setTimeout(() => {
				setIsRendered(false);
			}, EXIT_ANIMATION_MS);
			return () => window.clearTimeout(timer);
		}
	}, [isOpen, isRendered]);

	if (isLoading || !isRendered) {
		return null;
	}

	return (
		<div
			className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-opacity duration-200 ${
				isOpen ? "opacity-100" : "pointer-events-none opacity-0"
			}`}
		>
			<button
				type="button"
				aria-label="モーダルを閉じる"
				className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				onClick={() => setVisible(false)}
			/>
			<div
				className={`relative z-10 w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl transition-all duration-200 ease-out ${
					isOpen
						? "translate-y-0 scale-100 opacity-100"
						: "translate-y-2 scale-95 opacity-0"
				}`}
			>
				<div className="flex items-center justify-center space-x-2">
					<LogoIcon className="h-10 w-10" />
					<LogoMojiIcon className="h-6" />
				</div>
				<h2 className="text-center text-lg font-bold text-slate-800">
					コトバドをはじめよう！
				</h2>
				<p className="mt-2 text-center text-xs text-slate-500">
					コトバドは、バドミントンを語り合う掲示板です。
				</p>
				<div className="mt-4">
					<GoogleOAuth />
				</div>
			</div>
		</div>
	);
}
