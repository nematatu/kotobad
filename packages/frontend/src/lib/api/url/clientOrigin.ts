import { ensureTrailingSlash } from "../../../utils/url/ensureTrailingSlash";

export const getClientOrigin = (): string =>
	ensureTrailingSlash(window.location.origin);
