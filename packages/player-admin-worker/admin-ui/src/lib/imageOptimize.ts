const TARGET_MIME_TYPES = ["image/avif", "image/webp"] as const;
const ENCODE_QUALITY = 0.82;
const SIZE_IMPROVEMENT_THRESHOLD = 0.98;

const canvasToBlob = (
	canvas: HTMLCanvasElement,
	mimeType: string,
	quality: number,
): Promise<Blob | null> =>
	new Promise((resolve) => {
		canvas.toBlob(
			(blob) => {
				resolve(blob);
			},
			mimeType,
			quality,
		);
	});

const loadImage = (file: File): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file);
		const image = new Image();
		image.decoding = "async";
		image.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(image);
		};
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("画像デコードに失敗しました"));
		};
		image.src = objectUrl;
	});

const replaceFileExtension = (fileName: string, extension: string) => {
	const index = fileName.lastIndexOf(".");
	if (index === -1) {
		return `${fileName}.${extension}`;
	}
	return `${fileName.slice(0, index)}.${extension}`;
};

export const optimizeImageForUpload = async (file: File): Promise<File> => {
	if (!file.type.startsWith("image/")) {
		return file;
	}

	const sourceImage = await loadImage(file);
	const canvas = document.createElement("canvas");
	canvas.width = sourceImage.naturalWidth || sourceImage.width;
	canvas.height = sourceImage.naturalHeight || sourceImage.height;

	const context = canvas.getContext("2d");
	if (!context) {
		return file;
	}

	context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

	for (const mimeType of TARGET_MIME_TYPES) {
		const encodedBlob = await canvasToBlob(canvas, mimeType, ENCODE_QUALITY);
		if (!encodedBlob || encodedBlob.size === 0) {
			continue;
		}

		if (encodedBlob.size >= file.size * SIZE_IMPROVEMENT_THRESHOLD) {
			continue;
		}

		const extension = mimeType === "image/avif" ? "avif" : "webp";
		const optimizedName = replaceFileExtension(file.name, extension);
		return new File([encodedBlob], optimizedName, {
			type: mimeType,
			lastModified: Date.now(),
		});
	}

	return file;
};
