export type Offset = { x: number; y: number };
export type Size = { width: number; height: number };
type GuideRect = {
	width: number;
	height: number;
	left: number;
	top: number;
};

const OUTPUT_WIDTH = 1800;
const OUTPUT_HEIGHT = 450;
const FRAME_RATIO = OUTPUT_WIDTH / OUTPUT_HEIGHT;
const GUIDE_WIDTH_RATIO = 0.86;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const getBaseCoverScale = (imageSize: Size, guideRect: GuideRect) =>
	Math.max(
		guideRect.width / imageSize.width,
		guideRect.height / imageSize.height,
	);

const replaceExtension = (fileName: string, extension: string) => {
	const index = fileName.lastIndexOf(".");
	return index < 0
		? `${fileName}.${extension}`
		: `${fileName.slice(0, index)}.${extension}`;
};

const canvasToBlob = (
	canvas: HTMLCanvasElement,
	type: string,
	quality: number,
) =>
	new Promise<Blob | null>((resolve) =>
		canvas.toBlob((blob) => resolve(blob), type, quality),
	);

export const cleanupObjectUrl = (ref: { current: string | null }) => {
	if (!ref.current) return;
	URL.revokeObjectURL(ref.current);
	ref.current = null;
};

export const getGuideRect = (
	frameWidth: number,
	frameHeight: number,
): GuideRect | null => {
	if (frameWidth <= 0 || frameHeight <= 0) return null;
	const width = Math.max(frameWidth * GUIDE_WIDTH_RATIO, 1);
	const height = Math.max(width / FRAME_RATIO, 1);
	return {
		width,
		height,
		left: (frameWidth - width) / 2,
		top: (frameHeight - height) / 2,
	};
};

export const clampOffset = (
	offset: Offset,
	imageSize: Size,
	zoom: number,
	guideRect: GuideRect,
) => {
	const scale = getBaseCoverScale(imageSize, guideRect) * zoom;
	const renderedWidth = imageSize.width * scale;
	const renderedHeight = imageSize.height * scale;
	const xLimit = Math.max((renderedWidth - guideRect.width) / 2, 0);
	const yLimit = Math.max((renderedHeight - guideRect.height) / 2, 0);
	return {
		x: clamp(offset.x, -xLimit, xLimit),
		y: clamp(offset.y, -yLimit, yLimit),
	};
};

export const loadImageNaturalSize = async (
	file: File,
	objectUrl: string,
): Promise<Size> => {
	try {
		const bitmap = await createImageBitmap(file);
		const size = { width: bitmap.width, height: bitmap.height };
		bitmap.close();
		return size;
	} catch {
		return new Promise<Size>((resolve, reject) => {
			const probe = new Image();
			probe.onload = () =>
				resolve({
					width: probe.naturalWidth || probe.width,
					height: probe.naturalHeight || probe.height,
				});
			probe.onerror = () => reject(new Error("画像サイズの取得に失敗しました"));
			probe.src = objectUrl;
		});
	}
};

export const createCroppedHeaderFile = async ({
	file,
	image,
	frameElement,
	guideElement,
}: {
	file: File;
	image: HTMLImageElement;
	frameElement: HTMLDivElement;
	guideElement: HTMLDivElement;
}) => {
	const frameRect = frameElement.getBoundingClientRect();
	const imageRect = image.getBoundingClientRect();
	const cropRect = guideElement.getBoundingClientRect();
	const naturalWidth = image.naturalWidth || image.width;
	const naturalHeight = image.naturalHeight || image.height;
	const renderedWidth = imageRect.width;
	const renderedHeight = imageRect.height;
	if (
		naturalWidth < 1 ||
		naturalHeight < 1 ||
		renderedWidth <= 0 ||
		renderedHeight <= 0
	) {
		throw new Error("画像サイズの取得に失敗しました");
	}

	const cropLeft = cropRect.left - frameRect.left;
	const cropTop = cropRect.top - frameRect.top;
	const imageLeft = imageRect.left - frameRect.left;
	const imageTop = imageRect.top - frameRect.top;
	const sourceXUnclamped =
		((cropLeft - imageLeft) / renderedWidth) * naturalWidth;
	const sourceYUnclamped =
		((cropTop - imageTop) / renderedHeight) * naturalHeight;
	const sourceWidth = (cropRect.width / renderedWidth) * naturalWidth;
	const sourceHeight = (cropRect.height / renderedHeight) * naturalHeight;
	const sourceX = clamp(
		sourceXUnclamped,
		0,
		Math.max(naturalWidth - sourceWidth, 0),
	);
	const sourceY = clamp(
		sourceYUnclamped,
		0,
		Math.max(naturalHeight - sourceHeight, 0),
	);

	const canvas = document.createElement("canvas");
	canvas.width = OUTPUT_WIDTH;
	canvas.height = OUTPUT_HEIGHT;
	const context = canvas.getContext("2d");
	if (!context) throw new Error("画像処理コンテキストの取得に失敗しました");
	context.drawImage(
		image,
		sourceX,
		sourceY,
		sourceWidth,
		sourceHeight,
		0,
		0,
		OUTPUT_WIDTH,
		OUTPUT_HEIGHT,
	);

	const webpBlob = await canvasToBlob(canvas, "image/webp", 0.9);
	if (webpBlob) {
		return new File([webpBlob], replaceExtension(file.name, "webp"), {
			type: "image/webp",
			lastModified: Date.now(),
		});
	}
	const jpegBlob = await canvasToBlob(canvas, "image/jpeg", 0.92);
	if (!jpegBlob) throw new Error("切り抜き画像の生成に失敗しました");
	return new File([jpegBlob], replaceExtension(file.name, "jpg"), {
		type: "image/jpeg",
		lastModified: Date.now(),
	});
};
