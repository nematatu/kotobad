import {
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";

type Offset = {
	x: number;
	y: number;
};

type ImageSize = {
	width: number;
	height: number;
};

type DragState = {
	startX: number;
	startY: number;
	startOffset: Offset;
};

type ImageCropUploadDialogProps = {
	open: boolean;
	file: File | null;
	title: string;
	isUploading: boolean;
	uploadErrorMessage: string;
	onCloseAction: () => void;
	onSubmitAction: (file: File) => Promise<void>;
};

const FRAME_VIEW_SIZE = 360;
const CROP_BOX_SIZE = 280;
const OUTPUT_SIZE = 1024;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const getBaseCoverScale = (imageSize: ImageSize, cropBoxSize: number) =>
	cropBoxSize / Math.min(imageSize.width, imageSize.height);

const getOffsetLimit = (
	imageSize: ImageSize,
	zoom: number,
	cropBoxSize: number,
) => {
	const scale = getBaseCoverScale(imageSize, cropBoxSize) * zoom;
	const renderedWidth = imageSize.width * scale;
	const renderedHeight = imageSize.height * scale;
	return {
		x: Math.max((renderedWidth - cropBoxSize) / 2, 0),
		y: Math.max((renderedHeight - cropBoxSize) / 2, 0),
	};
};

const clampOffset = (
	offset: Offset,
	imageSize: ImageSize,
	zoom: number,
	cropBoxSize: number,
) => {
	const limit = getOffsetLimit(imageSize, zoom, cropBoxSize);
	return {
		x: clamp(offset.x, -limit.x, limit.x),
		y: clamp(offset.y, -limit.y, limit.y),
	};
};

const canvasToBlob = (
	canvas: HTMLCanvasElement,
	mimeType: string,
	quality: number,
): Promise<Blob | null> =>
	new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob), mimeType, quality);
	});

const replaceFileExtension = (fileName: string, extension: string) => {
	const index = fileName.lastIndexOf(".");
	if (index === -1) {
		return `${fileName}.${extension}`;
	}
	return `${fileName.slice(0, index)}.${extension}`;
};

const cropFileToSquare = async ({
	file,
	image,
	frameRect,
	imageRect,
	cropRect,
}: {
	file: File;
	image: HTMLImageElement;
	frameRect: DOMRect;
	imageRect: DOMRect;
	cropRect: DOMRect;
}) => {
	const naturalWidth = image.naturalWidth || image.width;
	const naturalHeight = image.naturalHeight || image.height;
	if (naturalWidth < 1 || naturalHeight < 1) {
		throw new Error("画像サイズの取得に失敗しました");
	}

	const renderedWidth = imageRect.width;
	const renderedHeight = imageRect.height;
	if (renderedWidth <= 0 || renderedHeight <= 0) {
		throw new Error("画像表示サイズの取得に失敗しました");
	}

	const cropLeft = cropRect.left - frameRect.left;
	const cropTop = cropRect.top - frameRect.top;
	const imageLeft = imageRect.left - frameRect.left;
	const imageTop = imageRect.top - frameRect.top;
	const sourceXUnclamped =
		((cropLeft - imageLeft) / renderedWidth) * naturalWidth;
	const sourceYUnclamped =
		((cropTop - imageTop) / renderedHeight) * naturalHeight;
	const sourceSizeByWidth = (cropRect.width / renderedWidth) * naturalWidth;
	const sourceSizeByHeight = (cropRect.height / renderedHeight) * naturalHeight;
	const cropSizeInSource = Math.min(sourceSizeByWidth, sourceSizeByHeight);
	const maxSourceX = Math.max(naturalWidth - cropSizeInSource, 0);
	const maxSourceY = Math.max(naturalHeight - cropSizeInSource, 0);
	const sourceX = clamp(sourceXUnclamped, 0, maxSourceX);
	const sourceY = clamp(sourceYUnclamped, 0, maxSourceY);

	const canvas = document.createElement("canvas");
	canvas.width = OUTPUT_SIZE;
	canvas.height = OUTPUT_SIZE;
	const context = canvas.getContext("2d");
	if (!context) {
		throw new Error("画像編集コンテキストの取得に失敗しました");
	}

	context.drawImage(
		image,
		sourceX,
		sourceY,
		cropSizeInSource,
		cropSizeInSource,
		0,
		0,
		OUTPUT_SIZE,
		OUTPUT_SIZE,
	);

	const webpBlob = await canvasToBlob(canvas, "image/webp", 0.92);
	if (webpBlob && webpBlob.size > 0) {
		return new File([webpBlob], replaceFileExtension(file.name, "webp"), {
			type: "image/webp",
			lastModified: Date.now(),
		});
	}

	const pngBlob = await canvasToBlob(canvas, "image/png", 1);
	if (!pngBlob || pngBlob.size === 0) {
		throw new Error("切り抜き画像の生成に失敗しました");
	}
	return new File([pngBlob], replaceFileExtension(file.name, "png"), {
		type: "image/png",
		lastModified: Date.now(),
	});
};

export const ImageCropUploadDialog = ({
	open,
	file,
	title,
	isUploading,
	uploadErrorMessage,
	onCloseAction,
	onSubmitAction,
}: ImageCropUploadDialogProps) => {
	const [imageSize, setImageSize] = useState<ImageSize | null>(null);
	const [zoom, setZoom] = useState(1);
	const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [isProcessingCrop, setIsProcessingCrop] = useState(false);
	const [cropErrorMessage, setCropErrorMessage] = useState("");
	const dragStateRef = useRef<DragState | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const frameRef = useRef<HTMLDivElement | null>(null);
	const guideRef = useRef<HTMLDivElement | null>(null);
	const previewUrlRef = useRef<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [frameSize, setFrameSize] = useState(FRAME_VIEW_SIZE);

	useEffect(() => {
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = null;
		}
		if (!file) {
			setPreviewUrl(null);
			setImageSize(null);
			setZoom(1);
			setOffset({ x: 0, y: 0 });
			setCropErrorMessage("");
			return;
		}
		const objectUrl = URL.createObjectURL(file);
		previewUrlRef.current = objectUrl;
		setPreviewUrl(objectUrl);
		setImageSize(null);
		setZoom(1);
		setOffset({ x: 0, y: 0 });
		setCropErrorMessage("");
		return () => {
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
				previewUrlRef.current = null;
			}
		};
	}, [file]);

	useEffect(() => {
		if (!open) {
			return;
		}
		setImageSize(null);
		setZoom(1);
		setOffset({ x: 0, y: 0 });
		setCropErrorMessage("");
		dragStateRef.current = null;
		setIsDragging(false);
	}, [open]);

	useEffect(() => {
		if (!open) {
			return;
		}
		const frameElement = frameRef.current;
		if (!frameElement) {
			return;
		}

		const updateFrameSize = () => {
			const nextSize = frameElement.clientWidth || FRAME_VIEW_SIZE;
			setFrameSize(nextSize);
		};

		updateFrameSize();
		const observer = new ResizeObserver(() => {
			updateFrameSize();
		});
		observer.observe(frameElement);

		return () => {
			observer.disconnect();
		};
	}, [open]);

	const cropBoxSize = useMemo(() => {
		const ratio = CROP_BOX_SIZE / FRAME_VIEW_SIZE;
		const dynamicSize = Math.round(frameSize * ratio);
		const maxSize = Math.max(frameSize - 16, 80);
		return clamp(dynamicSize, 80, maxSize);
	}, [frameSize]);

	useEffect(() => {
		if (!imageSize) {
			return;
		}
		setOffset((current) => clampOffset(current, imageSize, zoom, cropBoxSize));
	}, [imageSize, zoom, cropBoxSize]);

	const displayMetrics = useMemo(() => {
		if (!imageSize) {
			return null;
		}
		const scale = getBaseCoverScale(imageSize, cropBoxSize) * zoom;
		return {
			width: imageSize.width * scale,
			height: imageSize.height * scale,
		};
	}, [imageSize, zoom, cropBoxSize]);
	const cropGuideOffset = (frameSize - cropBoxSize) / 2;
	const cropGuideStyle = useMemo(
		() => ({
			width: `${cropBoxSize}px`,
			height: `${cropBoxSize}px`,
			left: `${cropGuideOffset}px`,
			top: `${cropGuideOffset}px`,
		}),
		[cropBoxSize, cropGuideOffset],
	);

	const disabled = isUploading || isProcessingCrop;

	const handleImageLoaded = () => {
		const element = imageRef.current;
		if (!element) {
			return;
		}
		const naturalWidth = element.naturalWidth || element.width;
		const naturalHeight = element.naturalHeight || element.height;
		if (naturalWidth < 1 || naturalHeight < 1) {
			setCropErrorMessage("画像サイズの取得に失敗しました");
			return;
		}
		setImageSize({
			width: naturalWidth,
			height: naturalHeight,
		});
		setOffset({ x: 0, y: 0 });
		setCropErrorMessage("");
	};

	const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (!imageSize || disabled) {
			return;
		}
		dragStateRef.current = {
			startX: event.clientX,
			startY: event.clientY,
			startOffset: offset,
		};
		setIsDragging(true);
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
		const dragState = dragStateRef.current;
		if (!dragState || !imageSize) {
			return;
		}
		const nextOffset = clampOffset(
			{
				x: dragState.startOffset.x + (event.clientX - dragState.startX),
				y: dragState.startOffset.y + (event.clientY - dragState.startY),
			},
			imageSize,
			zoom,
			cropBoxSize,
		);
		setOffset(nextOffset);
	};

	const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		dragStateRef.current = null;
		setIsDragging(false);
	};

	const handleZoomChange = (value: number) => {
		setZoom(value);
	};

	const handleApply = async () => {
		if (!file || !imageSize || !imageRef.current) {
			setCropErrorMessage("画像の読み込み完了後に実行してください");
			return;
		}
		const frameElement = frameRef.current;
		const guideElement = guideRef.current;
		if (!frameElement || !guideElement) {
			setCropErrorMessage("切り抜き領域の取得に失敗しました");
			return;
		}
		setCropErrorMessage("");
		setIsProcessingCrop(true);
		try {
			const croppedFile = await cropFileToSquare({
				file,
				image: imageRef.current,
				frameRect: frameElement.getBoundingClientRect(),
				imageRect: imageRef.current.getBoundingClientRect(),
				cropRect: guideElement.getBoundingClientRect(),
			});
			await onSubmitAction(croppedFile);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setCropErrorMessage(message);
		} finally {
			setIsProcessingCrop(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (nextOpen) {
					return;
				}
				if (disabled) {
					return;
				}
				onCloseAction();
			}}
		>
			<DialogContent className="player-editor-modal-content player-image-crop-modal-content">
				<div className="player-editor-modal-header">
					<DialogTitle>{title}</DialogTitle>
					<DialogClose asChild>
						<button type="button" className="ghost" disabled={disabled}>
							閉じる
						</button>
					</DialogClose>
				</div>
				<div className="player-image-crop-body">
					<p className="small">
						ドラッグで位置を調整し、ズームで切り抜き範囲を合わせてください（1:1）。
					</p>
					<div
						ref={frameRef}
						className="player-image-crop-frame"
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerEnd}
						onPointerCancel={handlePointerEnd}
						style={{ cursor: isDragging ? "grabbing" : "grab" }}
					>
						{previewUrl ? (
							<img
								ref={imageRef}
								src={previewUrl}
								alt="切り抜き編集"
								onLoad={handleImageLoaded}
								draggable={false}
								className="player-image-crop-target"
								style={
									displayMetrics
										? {
												width: `${displayMetrics.width}px`,
												height: `${displayMetrics.height}px`,
												left: `${frameSize / 2 + offset.x}px`,
												top: `${frameSize / 2 + offset.y}px`,
											}
										: undefined
								}
							/>
						) : (
							<div className="player-image-crop-placeholder">
								画像を読み込み中...
							</div>
						)}
						<div
							ref={guideRef}
							className="player-image-crop-guide"
							style={cropGuideStyle}
						/>
					</div>
					<div className="player-image-crop-zoom-row">
						<span>ズーム</span>
						<input
							type="range"
							min={MIN_ZOOM}
							max={MAX_ZOOM}
							step={0.01}
							value={zoom}
							disabled={!imageSize || disabled}
							onChange={(event) =>
								handleZoomChange(Number.parseFloat(event.target.value))
							}
						/>
						<span>{Math.round(zoom * 100)}%</span>
					</div>
					{cropErrorMessage.length > 0 ? (
						<p className="small">切り抜き失敗: {cropErrorMessage}</p>
					) : null}
					{uploadErrorMessage.length > 0 ? (
						<p className="small">画像アップロード失敗: {uploadErrorMessage}</p>
					) : null}
				</div>
				<div className="player-image-crop-actions">
					<button
						type="button"
						className="secondary"
						onClick={onCloseAction}
						disabled={disabled}
					>
						キャンセル
					</button>
					<button
						type="button"
						onClick={() => void handleApply()}
						disabled={!imageSize || disabled}
					>
						{disabled ? "アップロード中..." : "切り抜いてアップロード"}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
