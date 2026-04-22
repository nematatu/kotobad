import { toBase64Url } from "./toBase64Url";

const enc = new TextEncoder();

export const signHmac = async (
	secret: string,
	payload: string,
): Promise<string> => {
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);

	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
	return toBase64Url(new Uint8Array(sig));
};
