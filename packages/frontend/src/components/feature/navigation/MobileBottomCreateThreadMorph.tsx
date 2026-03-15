"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Drawer } from "vaul";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import {
	FamilyDrawerAnimatedContent,
	FamilyDrawerAnimatedWrapper,
	FamilyDrawerContent,
	FamilyDrawerOverlay,
	FamilyDrawerPortal,
	FamilyDrawerRoot,
	FamilyDrawerTrigger,
} from "@/components/ui/family-drawer";

type Props = {
	tags: TagType[];
	onOpenStateChange?: (open: boolean) => void;
};

const CREATE_TRIGGER_CLASSNAME =
	"route-transition-floating-action group inline-flex h-full min-h-[53px] w-full touch-manipulation select-none flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-blue-500/92 px-2 text-[9px] font-semibold leading-none text-white shadow-[0_12px_26px_-20px_rgba(37,99,235,1)] transition-[transform,filter,box-shadow] duration-120 ease-out active:translate-y-[1px] active:scale-[0.92] active:brightness-95 active:shadow-[0_6px_14px_-12px_rgba(37,99,235,1)] [@media(hover:hover)]:hover:brightness-110";
const DRAWER_HEIGHT_CLS = "h-[min(90vh,calc(100vh-1.5rem))]";

export function MobileBottomCreateThreadMorph({
	tags,
	onOpenStateChange,
}: Props) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			onOpenStateChange?.(open);
		},
		[onOpenStateChange],
	);

	const closeSurface = useCallback(() => {
		handleOpenChange(false);
	}, [handleOpenChange]);
	const handleCreated = useCallback(() => {
		router.refresh();
		handleOpenChange(false);
	}, [handleOpenChange, router]);

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
						size={18}
						className="transition-transform duration-100 group-active:scale-90"
					/>
					<span className="transition-transform duration-100 group-active:scale-95">
						投稿
					</span>
				</button>
			</FamilyDrawerTrigger>
			<FamilyDrawerPortal>
				<FamilyDrawerOverlay
					onClick={closeSurface}
					className="z-[180] bg-black/45 backdrop-blur-[1px]"
				/>
				<FamilyDrawerContent className="!z-[190] !inset-x-2 !bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] !mx-auto !w-auto !max-w-[min(96vw,460px)] !overflow-hidden !rounded-[1rem] !bg-transparent">
					<FamilyDrawerAnimatedWrapper className="!px-0 !pb-0 !pt-0">
						<FamilyDrawerAnimatedContent>
							<div
								className={`flex w-[min(96vw,460px)] ${DRAWER_HEIGHT_CLS} flex-col overflow-hidden rounded-[1rem] border border-slate-200/80 bg-white/95 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.55)] dark:border-slate-700 dark:bg-slate-950/95 dark:shadow-[0_20px_42px_-30px_rgba(2,6,23,0.95)]`}
							>
								<Drawer.Title className="sr-only">
									新規スレッドを作成
								</Drawer.Title>
								<header className="flex items-center justify-between border-b border-slate-200/80 px-3 py-2 dark:border-slate-700">
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
											新規スレッドを作成
										</p>
										<p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
											今の気持ちや話題をシェアしましょう
										</p>
									</div>
									<button
										type="button"
										aria-label="スレッド作成を閉じる"
										onClick={closeSurface}
										className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors [@media(hover:hover)]:hover:bg-slate-100 [@media(hover:hover)]:hover:text-slate-700 dark:text-slate-300 dark:[@media(hover:hover)]:hover:bg-slate-800 dark:[@media(hover:hover)]:hover:text-slate-100"
									>
										<X className="h-4 w-4" />
									</button>
								</header>
								<div className="min-h-0 overflow-y-auto">
									<CreateThreadForm
										autoFocusTitle
										initialTags={tags}
										onCreated={handleCreated}
									/>
								</div>
							</div>
						</FamilyDrawerAnimatedContent>
					</FamilyDrawerAnimatedWrapper>
				</FamilyDrawerContent>
			</FamilyDrawerPortal>
		</FamilyDrawerRoot>
	);
}
