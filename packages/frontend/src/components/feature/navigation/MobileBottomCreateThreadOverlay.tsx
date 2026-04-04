"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import { headingJosefinSans } from "@/lib/config/fonts";

type Props = {
	tags: TagType[];
	onOpenStateChangeAction?: (open: boolean) => void;
};

const CREATE_TRIGGER_CLASSNAME =
	"route-transition-floating-action group inline-flex h-full min-h-[53px] w-full touch-manipulation select-none flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-blue-500/92 px-2 text-[9px] font-semibold leading-none text-white shadow-[0_12px_26px_-20px_rgba(37,99,235,1)] transition-[transform,filter,box-shadow] duration-120 ease-out active:translate-y-[1px] active:scale-[0.92] active:brightness-95 active:shadow-[0_6px_14px_-12px_rgba(37,99,235,1)] [@media(hover:hover)]:hover:brightness-110";
const FULLSCREEN_HEIGHT_CLS = "h-[100dvh] min-h-[100dvh] max-h-[100dvh]";

export function MobileBottomCreateThreadOverlay({
	tags,
	onOpenStateChangeAction,
}: Props) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			onOpenStateChangeAction?.(open);
		},
		[onOpenStateChangeAction],
	);

	const closeSurface = useCallback(() => {
		handleOpenChange(false);
	}, [handleOpenChange]);
	const handleCreated = useCallback(() => {
		router.refresh();
		handleOpenChange(false);
	}, [handleOpenChange, router]);

	useEffect(() => {
		const body = document.body;
		if (isOpen) {
			body.dataset.createThreadDrawerOpen = "true";
			const previousOverflow = body.style.overflow;
			body.style.overflow = "hidden";
			return () => {
				delete body.dataset.createThreadDrawerOpen;
				body.style.overflow = previousOverflow;
			};
		} else {
			delete body.dataset.createThreadDrawerOpen;
		}
		return undefined;
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			handleOpenChange(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen, handleOpenChange]);

	return (
		<>
			<button
				type="button"
				aria-label={isOpen ? "スレッド作成を閉じる" : "スレッドを投稿する"}
				onClick={() => handleOpenChange(!isOpen)}
				className={`${CREATE_TRIGGER_CLASSNAME} ${
					isOpen ? "pointer-events-none opacity-0" : "opacity-100"
				}`}
			>
				<Plus
					size={28}
					className="transition-transform duration-100 group-active:scale-90"
				/>
			</button>
			{isOpen ? (
				<div className="fixed inset-0 z-[190]">
					<button
						type="button"
						aria-label="スレッド作成を閉じる"
						onClick={closeSurface}
						className="absolute inset-0 z-[180] bg-black/45 backdrop-blur-[1px]"
					/>
					<div className="absolute inset-0 z-[190]">
						<div
							role="dialog"
							aria-modal="true"
							aria-label="スレッドを作成"
							className="h-full w-full overflow-hidden bg-transparent outline-none"
						>
							<div
								className={`flex ${FULLSCREEN_HEIGHT_CLS} w-full flex-col overflow-hidden border-0 bg-white dark:bg-slate-950`}
							>
								<header className="relative flex items-center justify-center border-b border-slate-200/80 px-3 py-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] dark:border-slate-700">
									<div className="min-w-0 text-center">
										<p
											className={`${headingJosefinSans.className} truncate text-[22px] leading-none font-bold tracking-[0.06em] text-slate-900 dark:text-slate-100`}
										>
											Create Thread
										</p>
									</div>
								</header>
								<div
									className="min-h-0 overflow-y-auto pb-[env(safe-area-inset-bottom)]"
									data-pull-refresh-block="true"
								>
									<CreateThreadForm
										autoFocusTitle
										initialTags={tags}
										onCreated={handleCreated}
										closeSurface={closeSurface}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
