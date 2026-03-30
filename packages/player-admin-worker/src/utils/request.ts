export const parsePositiveInt = (input: string | undefined): number | null => {
	if (input === undefined) {
		return null;
	}
	if (!/^\d+$/.test(input)) {
		return null;
	}
	const parsed = Number.parseInt(input, 10);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

export const extractToken = (
	authorization: string | undefined,
): string | undefined => {
	if (!authorization) {
		return undefined;
	}
	const matched = authorization.match(/^Bearer\s+(.+)$/i);
	if (!matched) {
		return undefined;
	}
	return matched[1]?.trim();
};
