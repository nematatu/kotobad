import { INTERNAL_AUTH_HEADERS } from "@kotobad/shared/src/const/internalAuthHeaders";
import { signHmac } from "@kotobad/shared/src/utils/internalAuth/signHmac";
import { getRequiredEnv } from "@/lib/config/requiredEnv";
import { inputToUrl } from "./utils/inputToUrl";

const internalApiSecret = getRequiredEnv("INTERNAL_API_SECRET");

export const ensureInternalSecret = async (
	input: Parameters<typeof fetch>[0],
	header: Headers,
	method: string,
): Promise<Headers> => {
	const nextHeader = new Headers(header);
	const url = inputToUrl(input);
	const ts = Date.now().toString();
	const payload = `${method}\n${url.pathname}${url.search}\n${ts}`;
	const sig = await signHmac(internalApiSecret, payload);

	nextHeader.set(INTERNAL_AUTH_HEADERS.TS, ts);
	nextHeader.set(INTERNAL_AUTH_HEADERS.SIG, sig);

	return nextHeader;
};
