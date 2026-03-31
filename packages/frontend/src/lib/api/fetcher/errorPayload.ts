type ParsedErrorPayload = {
	error?: string;
	message?: string;
};

const parseErrorBody = (
	body: string | undefined,
): ParsedErrorPayload | null => {
	if (!body) {
		return null;
	}

	try {
		const parsed = JSON.parse(body) as unknown;
		if (typeof parsed === "string" && parsed.length > 0) {
			return { message: parsed };
		}
		if (typeof parsed === "object" && parsed !== null) {
			const record = parsed as Record<string, unknown>;
			return {
				error:
					typeof record.error === "string" && record.error.length > 0
						? record.error
						: undefined,
				message:
					typeof record.message === "string" && record.message.length > 0
						? record.message
						: undefined,
			};
		}
		return null;
	} catch {
		return null;
	}
};

export const toBffErrorPayload = (
	body: string | undefined,
	fallbackError: string,
): { error: string; message?: string } => {
	const parsed = parseErrorBody(body);
	if (!parsed) {
		return { error: fallbackError };
	}

	const error = parsed.error ?? fallbackError;
	return parsed.message ? { error, message: parsed.message } : { error };
};

export const getBffErrorMessage = (error: unknown): string | null => {
	const rawBody =
		typeof error === "object" &&
		error !== null &&
		"body" in error &&
		typeof error.body === "string"
			? error.body
			: undefined;
	const parsed = parseErrorBody(rawBody);
	if (!parsed) {
		return null;
	}
	return parsed.message ?? parsed.error ?? null;
};
