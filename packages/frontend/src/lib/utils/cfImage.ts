type CfImageOptions = {
	width?: number;
	height?: number;
	quality?: number;
	fit?: "cover" | "contain" | "scale-down" | "pad";
};

const normalizePositiveInt = (value: number | undefined): number | null => {
	if (!Number.isFinite(value)) {
		return null;
	}
	if (!value) {
		return null;
	}
	const rounded = Math.floor(value);
	return rounded > 0 ? rounded : null;
};

const shouldUseCfImageTransform = (): boolean => {
	if (process.env.NODE_ENV !== "production") {
		return false;
	}

	const explicit = process.env.NEXT_PUBLIC_CF_IMAGE_TRANSFORM;
	if (explicit === "true" || explicit === "1") {
		return true;
	}
	if (explicit === "false" || explicit === "0") {
		return false;
	}
	return true;
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

	const directives: string[] = ["format=auto", "onerror=redirect"];
	const quality = normalizePositiveInt(options.quality);
	const width = normalizePositiveInt(options.width);
	const height = normalizePositiveInt(options.height);

	if (quality) {
		directives.push(`quality=${quality}`);
	}
	if (width) {
		directives.push(`width=${width}`);
	}
	if (height) {
		directives.push(`height=${height}`);
	}
	if (options.fit) {
		directives.push(`fit=${options.fit}`);
	}

	return `/cdn-cgi/image/${directives.join(",")}/${sourceUrl}`;
};
