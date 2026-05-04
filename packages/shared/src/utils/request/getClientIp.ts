const firstNonEmptyHeaderValue = (value: string | null): string | null => {
	const firstValue = value
		?.split(",")
		.map((item) => item.trim())
		.find((item) => item.length > 0);

	return firstValue ?? null;
};

export function getClientIp(headers: Headers): string {
	const cloudflareIp = firstNonEmptyHeaderValue(
		headers.get("cf-connecting-ip"),
	);
	if (cloudflareIp) {
		return cloudflareIp;
	}

	const trueClientIp = firstNonEmptyHeaderValue(headers.get("true-client-ip"));
	if (trueClientIp) {
		return trueClientIp;
	}

	// X-Forwarded-For can be client-controlled. Use it only as a last fallback.
	const forwardedForIp = firstNonEmptyHeaderValue(
		headers.get("x-forwarded-for"),
	);
	return forwardedForIp ?? "unknown";
}
