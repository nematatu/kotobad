const MIME_TYPE_TO_ALLOWED_EXTENSIONS: Record<string, string[]> = {
	"image/jpeg": ["jpg", "jpeg"],
	"image/png": ["png"],
	"image/webp": ["webp"],
	"image/avif": ["avif"],
};

const MIME_TYPE_TO_R2_EXTENSION: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
};

const getLowercaseExtension = (fileName: string): string | null => {
	const dotIndex = fileName.lastIndexOf(".");
	if (dotIndex < 0 || dotIndex === fileName.length - 1) {
		return null;
	}
	return fileName.slice(dotIndex + 1).toLowerCase();
};

export const resolveAllowedImageFile = (
	file: File,
): { ok: true; extension: string } | { ok: false; error: string } => {
	const allowedExtensions = MIME_TYPE_TO_ALLOWED_EXTENSIONS[file.type];
	const r2Extension = MIME_TYPE_TO_R2_EXTENSION[file.type];
	if (!allowedExtensions || !r2Extension) {
		return {
			ok: false,
			error: "file type must be jpeg, png, webp, or avif",
		};
	}

	const fileExtension = getLowercaseExtension(file.name);
	if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
		return {
			ok: false,
			error: "file extension must match jpeg, png, webp, or avif",
		};
	}

	return { ok: true, extension: r2Extension };
};
