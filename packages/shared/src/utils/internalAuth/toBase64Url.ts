export const toBase64Url = (bytes: Uint8Array) => {
	return Buffer.from(bytes)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+/g, "");
};
