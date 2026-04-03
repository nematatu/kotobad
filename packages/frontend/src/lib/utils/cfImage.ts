export type CfImageOptions = {
	width?: number;
	height?: number;
	quality?: number;
	fit?: "cover" | "contain" | "scale-down" | "pad";
};

export type CfImagePreset =
	| "post"
	| "threadList"
	| "zoom"
	| "avatar"
	| "profileHeader"
	| "tagIcon"
	| "playerCard"
	| "playerThumb"
	| "playerZoom";

export const CF_IMAGE_PRESET_OPTIONS: Record<CfImagePreset, CfImageOptions> = {
	post: {
		width: 560,
		quality: 70,
		fit: "cover",
	},
	threadList: {
		width: 220,
		quality: 60,
		fit: "cover",
	},
	zoom: {
		width: 1800,
		quality: 82,
		fit: "contain",
	},
	avatar: {
		width: 96,
		quality: 68,
		fit: "cover",
	},
	profileHeader: {
		width: 1440,
		height: 360,
		quality: 72,
		fit: "cover",
	},
	tagIcon: {
		width: 48,
		quality: 68,
		fit: "contain",
	},
	playerCard: {
		width: 420,
		quality: 72,
		fit: "cover",
	},
	playerThumb: {
		width: 192,
		height: 192,
		quality: 72,
		fit: "cover",
	},
	playerZoom: {
		width: 1200,
		height: 1200,
		quality: 82,
		fit: "cover",
	},
};

const CF_IMAGE_ALLOWED_SOURCE_PREFIXES = [
	"https://kotobad.com/",
	"https://www.kotobad.com/",
	"https://kotobad-bucket.kotobad.com/",
];

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

const canApplyCfImageTransform = (sourceUrl: string) => {
	if (sourceUrl.startsWith("/")) {
		return true;
	}

	return CF_IMAGE_ALLOWED_SOURCE_PREFIXES.some((prefix) =>
		sourceUrl.startsWith(prefix),
	);
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

	if (!canApplyCfImageTransform(sourceUrl)) {
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
