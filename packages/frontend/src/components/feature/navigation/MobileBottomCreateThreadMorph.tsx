"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import { MorphSurface } from "@/components/ui/morph-surface";

type Props = {
	tags: TagType[];
	onOpenStateChange?: (open: boolean) => void;
};

const COLLAPSED_HEIGHT = 53;
const COLLAPSED_WIDTH = 72;
const DEFAULT_EXPANDED_HEIGHT = 520;
const DEFAULT_EXPANDED_WIDTH = 360;
const EXPANDED_HORIZONTAL_MARGIN = 16;
const MAX_EXPANDED_HEIGHT = 620;
const MAX_EXPANDED_WIDTH = 460;
const MIN_EXPANDED_HEIGHT = 420;
const MIN_EXPANDED_WIDTH = 300;
const SURFACE_HEIGHT_RATIO = 0.74;
const CREATE_TRIGGER_CLASSNAME =
	"route-transition-floating-action group inline-flex h-full min-h-[53px] w-full touch-manipulation select-none flex-col items-center justify-center gap-1.5 rounded-[1rem] bg-blue-500/92 px-2 text-[9px] font-semibold leading-none text-white shadow-[0_12px_26px_-20px_rgba(37,99,235,1)] transition-[transform,filter,box-shadow] duration-120 ease-out active:translate-y-[1px] active:scale-[0.92] active:brightness-95 active:shadow-[0_6px_14px_-12px_rgba(37,99,235,1)] [@media(hover:hover)]:hover:brightness-110";

const getExpandedSurfaceSize = () => {
	if (typeof window === "undefined") {
		return {
			height: DEFAULT_EXPANDED_HEIGHT,
			width: DEFAULT_EXPANDED_WIDTH,
		};
	}

	const width = Math.min(
		MAX_EXPANDED_WIDTH,
		Math.max(
			MIN_EXPANDED_WIDTH,
			window.innerWidth - EXPANDED_HORIZONTAL_MARGIN,
		),
	);
	const height = Math.min(
		MAX_EXPANDED_HEIGHT,
		Math.max(
			MIN_EXPANDED_HEIGHT,
			Math.floor(window.innerHeight * SURFACE_HEIGHT_RATIO),
		),
	);

	return { width, height };
};

export function MobileBottomCreateThreadMorph({
	tags,
	onOpenStateChange,
}: Props) {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [expandedSize, setExpandedSize] = useState({
		width: DEFAULT_EXPANDED_WIDTH,
		height: DEFAULT_EXPANDED_HEIGHT,
	});

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			onOpenStateChange?.(open);
		},
		[onOpenStateChange],
	);

	const syncSize = useCallback(() => {
		const next = getExpandedSurfaceSize();
		setExpandedSize((current) => {
			if (current.width === next.width && current.height === next.height) {
				return current;
			}
			return next;
		});
	}, []);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		syncSize();
		window.addEventListener("resize", syncSize);
		return () => window.removeEventListener("resize", syncSize);
	}, [syncSize]);

	const createTriggerLabel = isOpen
		? "スレッド作成を閉じる"
		: "スレッドを投稿する";
	const closeSurface = useCallback(() => {
		handleOpenChange(false);
	}, [handleOpenChange]);

	const renderDock = useCallback(
		({
			isOpen: dockOpen,
			onToggle,
		}: {
			isOpen: boolean;
			onToggle: () => void;
		}) => {
			if (dockOpen) {
				return null;
			}

			return (
				<button
					type="button"
					aria-label={createTriggerLabel}
					onClick={(event) => {
						event.stopPropagation();
						onToggle();
					}}
					className={CREATE_TRIGGER_CLASSNAME}
				>
					<Plus
						size={18}
						className="transition-transform duration-100 group-active:scale-90"
					/>
					<span className="transition-transform duration-100 group-active:scale-95">
						投稿
					</span>
				</button>
			);
		},
		[createTriggerLabel],
	);

	const renderContent = useCallback(
		({ onClose }: { onClose: () => void }) => (
			<div className="flex h-full flex-col overflow-hidden rounded-[1rem] bg-white/95 dark:bg-slate-950/95">
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
						onClick={(event) => {
							event.preventDefault();
							onClose();
						}}
						className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors [@media(hover:hover)]:hover:bg-slate-100 [@media(hover:hover)]:hover:text-slate-700 dark:text-slate-300 dark:[@media(hover:hover)]:hover:bg-slate-800 dark:[@media(hover:hover)]:hover:text-slate-100"
					>
						<X className="h-4 w-4" />
					</button>
				</header>
				<div className="min-h-0 overflow-y-auto">
					<CreateThreadForm
						autoFocusTitle
						initialTags={tags}
						onCreated={() => {
							router.refresh();
							handleOpenChange(false);
						}}
					/>
				</div>
			</div>
		),
		[handleOpenChange, router, tags],
	);
	const renderIndicator = useCallback(() => null, []);

	return (
		<>
			{isOpen && isMounted
				? createPortal(
						<button
							type="button"
							aria-label="スレッド作成フォームを閉じる"
							onClick={closeSurface}
							className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[1px]"
						/>,
						document.body,
					)
				: null}
			<MorphSurface
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				collapsedWidth={COLLAPSED_WIDTH}
				collapsedHeight={COLLAPSED_HEIGHT}
				expandedWidth={expandedSize.width}
				expandedHeight={expandedSize.height}
				overlayExpand
				animationSpeed={0.9}
				className="h-[53px] w-full"
				surfaceClassName={
					isOpen
						? "z-[100] rounded-[1rem] border border-slate-200/80 bg-white/95 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.55)] dark:border-slate-700 dark:bg-slate-950/95 dark:shadow-[0_20px_42px_-30px_rgba(2,6,23,0.95)]"
						: "z-[100] rounded-[1rem] border border-transparent bg-transparent shadow-none"
				}
				dockClassName="mt-0 h-[53px] w-full"
				contentClassName="!p-0"
				showContentAnchorDot={false}
				wrapContentWithForm={false}
				renderIndicator={renderIndicator}
				renderDock={renderDock}
				renderContent={renderContent}
			/>
		</>
	);
}
