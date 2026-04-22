import { INTERNAL_AUTH_HEADERS } from "@kotobad/shared/src/const/internalAuthHeaders";
import { signHmac } from "@kotobad/shared/src/utils/internalAuth/signHmac";
import { inputToUrl } from "./utils/inputToUrl";

export const ensureInternalSecret = async (
	input: Parameters<typeof fetch>[0],
	header: Headers,
	method: string,
): Promise<Headers> => {
	const secret = process.env.INTERNAL_API_SECRET;
	if (!secret) throw new Error("INTERNAL_API_SECRET is not configured");

	const nextHeader = new Headers(header);
	const url = inputToUrl(input);
	const ts = Date.now().toString();
	const payload = `${method}\n${url.pathname}${url.search}\n${ts}`;
	const sig = await signHmac(secret, payload);

	nextHeader.set(INTERNAL_AUTH_HEADERS.TS, ts);
	nextHeader.set(INTERNAL_AUTH_HEADERS.SIG, sig);

	return nextHeader;
};
