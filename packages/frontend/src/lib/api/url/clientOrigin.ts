import { ensureTrailingSlash } from "@kotobad/shared/src/utils/url/ensureTrailingSlash";

export const getClientOrigin = (): string =>
	ensureTrailingSlash(window.location.origin);
