export const ensureTrailingSlash = (value: string): string =>
	value.endsWith("/") ? value : `${value}/`;
