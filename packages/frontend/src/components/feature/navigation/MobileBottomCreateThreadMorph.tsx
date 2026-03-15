"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Drawer } from "vaul";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import {
	FamilyDrawerOverlay,
	FamilyDrawerPortal,
	FamilyDrawerRoot,
	FamilyDrawerTrigger,
} from "@/components/ui/family-drawer";

type Props = {
	tags: TagType[];
	onOpenStateChangeAction?: (open: boolean) => void;
};

const CREATE_TRIGGER_CLASSNAME =
	"route-transition-floating-action group inline-flex h-full min-h-[53px] w-full touch-manipulation select-none flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-blue-500/92 px-2 text-[9px] font-semibold leading-none text-white shadow-[0_12px_26px_-20px_rgba(37,99,235,1)] transition-[transform,filter,box-shadow] duration-120 ease-out active:translate-y-[1px] active:scale-[0.92] active:brightness-95 active:shadow-[0_6px_14px_-12px_rgba(37,99,235,1)] [@media(hover:hover)]:hover:brightness-110";
const MAX_DRAWER_HEIGHT = 840;
const MIN_DRAWER_HEIGHT = 520;
const DRAWER_VERTICAL_MARGIN = 24;

export function MobileBottomCreateThreadMorph({
	tags,
	onOpenStateChangeAction,
}: Props) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [fixedDrawerHeight, setFixedDrawerHeight] = useState<number | null>(
		null,
	);

	const resolveDrawerHeight = useCallback((viewportHeight: number) => {
		return Math.max(
			MIN_DRAWER_HEIGHT,
			Math.min(MAX_DRAWER_HEIGHT, viewportHeight - DRAWER_VERTICAL_MARGIN),
		);
	}, []);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (open) {
				const viewportHeight =
					window.visualViewport?.height ?? window.innerHeight;
				setFixedDrawerHeight(resolveDrawerHeight(viewportHeight));
			} else {
				setFixedDrawerHeight(null);
			}
			setIsOpen(open);
			onOpenStateChangeAction?.(open);
		},
		[onOpenStateChangeAction, resolveDrawerHeight],
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
		} else {
			delete body.dataset.createThreadDrawerOpen;
		}

		return () => {
			delete body.dataset.createThreadDrawerOpen;
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		const focusTimeoutId = window.setTimeout(() => {
			const titleField = document.getElementById("thread-title");
			if (titleField instanceof HTMLTextAreaElement) {
				titleField.focus({ preventScroll: true });
			}
		}, 220);
		return () => window.clearTimeout(focusTimeoutId);
	}, [isOpen]);

	return (
		<FamilyDrawerRoot open={isOpen} onOpenChange={handleOpenChange}>
			<FamilyDrawerTrigger asChild>
				<button
					type="button"
					aria-label={isOpen ? "スレッド作成を閉じる" : "スレッドを投稿する"}
					className={`${CREATE_TRIGGER_CLASSNAME} ${
						isOpen ? "pointer-events-none opacity-0" : "opacity-100"
					}`}
				>
					<Plus
						size={28}
						className="transition-transform duration-100 group-active:scale-90"
					/>
				</button>
			</FamilyDrawerTrigger>
			<FamilyDrawerPortal>
				<FamilyDrawerOverlay
					onClick={closeSurface}
					className="z-[180] bg-black/85 backdrop-blur-[1px]"
				/>
				<Drawer.Content className="fixed inset-x-0 bottom-0 z-[190] h-[100lvh] bg-transparent outline-none pointer-events-none">
					<div className="pointer-events-auto absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)]">
						<div
							className="flex w-full flex-col overflow-hidden rounded-[1rem] border border-slate-200/80 bg-white/95 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.55)] dark:border-slate-700 dark:bg-slate-950/95 dark:shadow-[0_20px_42px_-30px_rgba(2,6,23,0.95)]"
							style={
								fixedDrawerHeight
									? {
											height: `${fixedDrawerHeight}px`,
											minHeight: `${fixedDrawerHeight}px`,
											maxHeight: `${fixedDrawerHeight}px`,
										}
									: undefined
							}
						>
							<Drawer.Title className="sr-only">スレッドを作成</Drawer.Title>
							<header className="relative flex items-center justify-center border-b border-slate-200/80 px-3 py-4 dark:border-slate-700">
								<button
									type="button"
									aria-label="スレッド作成を閉じる"
									onClick={closeSurface}
									className="absolute left-3 inline-flex items-center text-left text-slate-500 transition-colors dark:text-slate-300"
								>
									<p>キャンセル</p>
								</button>
								<div className="min-w-0 text-center">
									<p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
										スレッドを作成
									</p>
								</div>
							</header>
							<div className="min-h-0 overflow-y-auto">
								<CreateThreadForm
									initialTags={tags}
									onCreated={handleCreated}
								/>
							</div>
						</div>
					</div>
				</Drawer.Content>
			</FamilyDrawerPortal>
		</FamilyDrawerRoot>
	);
}
