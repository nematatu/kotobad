"use client";

import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import type {
	ChangeEvent as ReactChangeEvent,
	PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	clampOffset,
	cleanupObjectUrl,
	createCroppedHeaderFile,
	getGuideRect,
	loadImageNaturalSize,
	type Offset,
	type Size,
} from "./headerImageCropUtils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type DragState = {
	startX: number;
	startY: number;
	startOffset: Offset;
};

type Props = {
	open: boolean;
	file: File | null;
	onCloseAction: () => void;
	onApplyAction: (file: File) => void;
};

const isSameOffset = (left: Offset, right: Offset) =>
	left.x === right.x && left.y === right.y;

export function HeaderImageCropDialog({
	open,
	file,
	onCloseAction,
	onApplyAction,
}: Props) {
	const [activeFile, setActiveFile] = useState<File | null>(file);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [imageSize, setImageSize] = useState<Size | null>(null);
	const [zoom, setZoom] = useState(1);
	const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
	const [isProcessing, setIsProcessing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [frameRef, frameBounds] = useMeasure();
	const frameElementRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const guideRef = useRef<HTMLDivElement | null>(null);
	const changeImageInputRef = useRef<HTMLInputElement | null>(null);
	const dragStateRef = useRef<DragState | null>(null);
	const previewUrlRef = useRef<string | null>(null);

	const frameSize = { width: frameBounds.width, height: frameBounds.height };
	const guideRect = getGuideRect(frameSize.width, frameSize.height);
	const displayMetrics =
		imageSize && guideRect
			? (() => {
					const scale =
						Math.max(
							guideRect.width / imageSize.width,
							guideRect.height / imageSize.height,
						) * zoom;
					return {
						width: imageSize.width * scale,
						height: imageSize.height * scale,
					};
				})()
			: null;

	const disabled = isProcessing;

	const setFrameRefsAction = (node: HTMLDivElement | null) => {
		frameElementRef.current = node;
		frameRef(node);
	};

	useEffect(() => {
		if (!open) return;
		setActiveFile(file);
		setZoom(1);
		setOffset({ x: 0, y: 0 });
		setErrorMessage("");
	}, [open, file]);

	useEffect(() => {
		cleanupObjectUrl(previewUrlRef);
		if (!activeFile) {
			setPreviewUrl(null);
			setImageSize(null);
			return;
		}

		const objectUrl = URL.createObjectURL(activeFile);
		previewUrlRef.current = objectUrl;
		setPreviewUrl(objectUrl);
		setImageSize(null);
		setErrorMessage("");

		let cancelled = false;
		void loadImageNaturalSize(activeFile, objectUrl)
			.then((size) => {
				if (!cancelled) setImageSize(size);
			})
			.catch(() => {
				if (!cancelled) setErrorMessage("画像サイズの取得に失敗しました");
			});

		return () => {
			cancelled = true;
			cleanupObjectUrl(previewUrlRef);
		};
	}, [activeFile]);

	useEffect(() => {
		if (!imageSize || !guideRect) return;
		setOffset((current) => {
			const next = clampOffset(current, imageSize, zoom, guideRect);
			return isSameOffset(current, next) ? current : next;
		});
	}, [imageSize, zoom, guideRect]);

	const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (!imageSize || !guideRect || disabled) return;
		dragStateRef.current = {
			startX: event.clientX,
			startY: event.clientY,
			startOffset: offset,
		};
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
		const dragState = dragStateRef.current;
		if (!dragState || !imageSize || !guideRect) return;
		const next = clampOffset(
			{
				x: dragState.startOffset.x + (event.clientX - dragState.startX),
				y: dragState.startOffset.y + (event.clientY - dragState.startY),
			},
			imageSize,
			zoom,
			guideRect,
		);
		if (isSameOffset(offset, next)) return;
		setOffset(next);
	};

	const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		dragStateRef.current = null;
	};

	const handleApply = async () => {
		if (
			!activeFile ||
			!imageRef.current ||
			!guideRef.current ||
			!frameElementRef.current
		) {
			setErrorMessage("画像の読み込み後にお試しください");
			return;
		}

		setErrorMessage("");
		setIsProcessing(true);
		try {
			const croppedFile = await createCroppedHeaderFile({
				file: activeFile,
				image: imageRef.current,
				frameElement: frameElementRef.current,
				guideElement: guideRef.current,
			});
			onApplyAction(croppedFile);
		} catch (error: unknown) {
			setErrorMessage(
				error instanceof Error ? error.message : "切り抜きに失敗しました",
			);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleChangeSourceImageAction = (
		event: ReactChangeEvent<HTMLInputElement>,
	) => {
		const nextFile = event.target.files?.[0] ?? null;
		if (nextFile) {
			setActiveFile(nextFile);
		}
		event.currentTarget.value = "";
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) onCloseAction();
			}}
		>
			<DialogContent
				className="w-[calc(100vw-1rem)] max-w-5xl overflow-hidden rounded-xl p-0"
				closeButtonClassName="right-3 top-3 z-30 h-8 w-8 bg-white/90 text-slate-700 opacity-100"
			>
				<DialogHeader className="border-b px-4 py-3">
					<DialogTitle className="text-sm sm:text-base">
						ヘッダー画像を切り抜き
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 p-4 sm:p-5">
					<div
						ref={setFrameRefsAction}
						className="relative mx-auto w-full max-w-4xl cursor-grab overflow-hidden rounded-lg border border-slate-300 bg-[#020617] active:cursor-grabbing"
						style={{
							aspectRatio: "16 / 9",
							touchAction: "none",
						}}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerEnd}
						onPointerCancel={handlePointerEnd}
					>
						{previewUrl ? (
							/* biome-ignore lint/performance/noImgElement: Canvas切り抜きで自然サイズ参照が必要 */
							<img
								ref={imageRef}
								src={previewUrl}
								alt="ヘッダー画像クロップ"
								draggable={false}
								className="pointer-events-none absolute max-w-none select-none"
								style={
									displayMetrics
										? {
												width: `${displayMetrics.width}px`,
												height: `${displayMetrics.height}px`,
												left: `${frameSize.width / 2 + offset.x}px`,
												top: `${frameSize.height / 2 + offset.y}px`,
												transform: "translate(-50%, -50%)",
											}
										: undefined
								}
							/>
						) : (
							<div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
								画像を読み込み中...
							</div>
						)}
						{guideRect ? (
							<div
								ref={guideRef}
								className="pointer-events-none absolute relative border border-[#38bdf8]"
								style={{
									width: `${guideRect.width}px`,
									height: `${guideRect.height}px`,
									left: `${guideRect.left}px`,
									top: `${guideRect.top}px`,
									boxShadow: "0 0 0 9999px rgb(15 23 42 / 50%)",
								}}
							>
								<div className="absolute left-[33.333%] top-0 bottom-0 w-px -translate-x-1/2 bg-white/35" />
								<div className="absolute left-[66.666%] top-0 bottom-0 w-px -translate-x-1/2 bg-white/35" />
								<div className="absolute top-[33.333%] left-0 right-0 h-px -translate-y-1/2 bg-white/35" />
								<div className="absolute top-[66.666%] left-0 right-0 h-px -translate-y-1/2 bg-white/35" />
							</div>
						) : null}
					</div>

					<div className="mx-auto grid w-full max-w-4xl grid-cols-[auto_1fr_auto_auto] items-center gap-2">
						<ZoomOut className="h-4 w-4 text-slate-600" />
						<input
							type="range"
							min={MIN_ZOOM}
							max={MAX_ZOOM}
							step={0.01}
							value={zoom}
							onChange={(event) => setZoom(Number(event.target.value))}
							disabled={!imageSize || disabled}
						/>
						<ZoomIn className="h-4 w-4 text-slate-600" />
						<span className="text-xs text-slate-600">
							{Math.round(zoom * 100)}%
						</span>
					</div>
					{errorMessage ? (
						<p className="mx-auto w-full max-w-4xl text-xs text-rose-600">
							{errorMessage}
						</p>
					) : null}
					<div className="mx-auto flex w-full max-w-4xl justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => changeImageInputRef.current?.click()}
							disabled={disabled}
						>
							画像を変更する
						</Button>
						<input
							ref={changeImageInputRef}
							type="file"
							accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
							className="hidden"
							onChange={handleChangeSourceImageAction}
						/>
					</div>
				</div>

				<div className="flex items-center justify-between gap-2 border-t px-4 py-3">
					<div />
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onCloseAction}
							disabled={disabled}
						>
							キャンセル
						</Button>
						<Button
							type="button"
							variant="zenn-like"
							onClick={() => void handleApply()}
							disabled={!imageSize || !guideRect || disabled}
						>
							{disabled ? (
								<span className="inline-flex items-center gap-1.5">
									<Loader2 className="h-4 w-4 animate-spin" />
									処理中
								</span>
							) : (
								"適用する"
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
