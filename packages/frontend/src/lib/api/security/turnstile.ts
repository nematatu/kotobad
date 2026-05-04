import { getClientIp } from "@kotobad/shared/src/utils/request/getClientIp";
import { NextResponse } from "next/server";

type TurnstileScope = "upload" | "createThread" | "createPost";

type TurnstileSiteverifyResponse = {
	success: boolean;
	hostname?: string;
	"error-codes"?: string[];
};

const TURNSTILE_SITEVERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TOKEN_HEADER = "x-turnstile-token";
const TURNSTILE_RESPONSE_FIELDS = ["cf-turnstile-response", "turnstileToken"];
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;

const parseCsv = (value: string | undefined) =>
	value
		?.split(",")
		.map((item) => item.trim())
		.filter(Boolean) ?? [];

const isScopeEnforced = (scope: TurnstileScope) => {
	const scopes = parseCsv(process.env.TURNSTILE_ENFORCE_SCOPES);
	return scopes.includes("*") || scopes.includes(scope);
};

const isHostnameAllowed = (hostname: string | undefined) => {
	const allowedHostnames = parseCsv(process.env.TURNSTILE_ALLOWED_HOSTNAMES);
	if (allowedHostnames.length === 0) {
		return true;
	}
	return typeof hostname === "string" && allowedHostnames.includes(hostname);
};

const toSiteverifyResponse = (
	value: unknown,
): TurnstileSiteverifyResponse | null => {
	if (typeof value !== "object" || value === null) {
		return null;
	}
	const record = value as Record<string, unknown>;
	return {
		success: record.success === true,
		hostname: typeof record.hostname === "string" ? record.hostname : undefined,
		"error-codes": Array.isArray(record["error-codes"])
			? record["error-codes"].filter(
					(item): item is string => typeof item === "string",
				)
			: undefined,
	};
};

export const getTurnstileTokenFromFormData = (
	formData: FormData,
): string | null => {
	for (const field of TURNSTILE_RESPONSE_FIELDS) {
		const value = formData.get(field);
		if (typeof value === "string" && value.length > 0) {
			return value;
		}
	}
	return null;
};

export const getTurnstileTokenFromJson = (value: unknown): string | null => {
	if (typeof value !== "object" || value === null) {
		return null;
	}
	const record = value as Record<string, unknown>;
	for (const field of TURNSTILE_RESPONSE_FIELDS) {
		const token = record[field];
		if (typeof token === "string" && token.length > 0) {
			return token;
		}
	}
	return null;
};

export const verifyTurnstileToken = async ({
	req,
	scope,
	token,
}: {
	req: Request;
	scope: TurnstileScope;
	token?: string | null;
}): Promise<NextResponse | null> => {
	if (!isScopeEnforced(scope)) {
		return null;
	}

	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		return NextResponse.json(
			{ error: "Turnstile is not configured" },
			{ status: 500 },
		);
	}

	const candidateToken = token ?? req.headers.get(TURNSTILE_TOKEN_HEADER);
	if (!candidateToken || candidateToken.length > MAX_TURNSTILE_TOKEN_LENGTH) {
		return NextResponse.json(
			{ error: "Turnstile verification required" },
			{ status: 403 },
		);
	}

	const body = new URLSearchParams({
		secret,
		response: candidateToken,
		idempotency_key: crypto.randomUUID(),
	});
	const remoteIp = getClientIp(req.headers);
	if (remoteIp !== "unknown") {
		body.set("remoteip", remoteIp);
	}

	let siteverify: TurnstileSiteverifyResponse | null = null;
	try {
		const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
		});
		siteverify = toSiteverifyResponse(await response.json());
	} catch {
		return NextResponse.json(
			{ error: "Turnstile verification unavailable" },
			{ status: 503 },
		);
	}

	if (!siteverify?.success || !isHostnameAllowed(siteverify.hostname)) {
		return NextResponse.json(
			{ error: "Turnstile verification failed" },
			{ status: 403 },
		);
	}

	return null;
};
