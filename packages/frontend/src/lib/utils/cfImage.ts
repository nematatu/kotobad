export type CfImageOptions = {
	width?: number;
	height?: number;
	quality?: number;
	fit?: "cover" | "contain" | "scale-down" | "pad";
};

export type CfImagePreset = "post" | "threadList" | "zoom";

export const CF_IMAGE_PRESET_OPTIONS: Record<CfImagePreset, CfImageOptions> = {
	post: {
		width: 560,
		quality: 70,
		fit: "cover",
	},
	threadList: {
		width: 480,
		quality: 70,
		fit: "cover",
	},
	zoom: {
		width: 1800,
		quality: 82,
		fit: "contain",
	},
};

const normalizePositiveInt = (value?: number): number | null => {
	if (!value || !Number.isFinite(value)) {
		return null;
	}
	const rounded = Math.floor(value);
	return rounded > 0 ? rounded : null;
};

const shouldUseCfImageTransform = () => {
	if (process.env.NODE_ENV !== "production") {
		return false;
	}
	const explicit = process.env.NEXT_PUBLIC_CF_IMAGE_TRANSFORM;
	if (!explicit) {
		return true;
	}
	return explicit === "true" || explicit === "1";
};

export const toCfImageUrl = (
	sourceUrl: string | null | undefined,
	options: CfImageOptions = {},
): string | null => {
	if (!sourceUrl) {
		return null;
	}

	if (
		sourceUrl.startsWith("/cdn-cgi/image/") ||
		sourceUrl.startsWith("blob:") ||
		sourceUrl.startsWith("data:")
	) {
		return sourceUrl;
	}

	if (!shouldUseCfImageTransform()) {
		return sourceUrl;
	}

	const quality = normalizePositiveInt(options.quality);
	const width = normalizePositiveInt(options.width);
	const height = normalizePositiveInt(options.height);
	const directives = [
		"format=auto",
		"onerror=redirect",
		quality ? `quality=${quality}` : null,
		width ? `width=${width}` : null,
		height ? `height=${height}` : null,
		options.fit ? `fit=${options.fit}` : null,
	].filter((directive): directive is string => directive !== null);

	return `/cdn-cgi/image/${directives.join(",")}/${sourceUrl}`;
};

export const toPresetCfImageUrl = (
	sourceUrl: string | null | undefined,
	preset: CfImagePreset,
) => {
	return toCfImageUrl(sourceUrl, CF_IMAGE_PRESET_OPTIONS[preset]);
};
