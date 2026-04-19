const CSRF_TOKEN_ENDPOINT = "/threads/api/csrf-token";

let csrfTokenCache: string | null = null;
let csrfTokenInFlight: Promise<string> | null = null;
let resetTokenInFlight: Promise<string> | null = null;

export async function ensureCsrfToken(): Promise<string> {
	if (csrfTokenCache) return csrfTokenCache;
	if (csrfTokenInFlight) return csrfTokenInFlight;

	csrfTokenInFlight = (async () => {
		const res = await fetch(CSRF_TOKEN_ENDPOINT, {
			method: "GET",
			cache: "no-store",
			credentials: "same-origin",
		});
		if (!res.ok)
			throw new Error(`Failed to fetch csrf token: ${res.statusText}`);
		const data = (await res.json()) as { csrfToken: string };
		if (!data?.csrfToken) throw new Error("Failed to fetch csrf token");
		csrfTokenCache = data.csrfToken;
		return data.csrfToken;
	})().finally(() => {
		csrfTokenInFlight = null;
	});

	return csrfTokenInFlight;
}

export async function resetCsrfToken() {
	if (resetTokenInFlight) return resetTokenInFlight;
	resetTokenInFlight = (async () => {
		csrfTokenCache = null;
		csrfTokenInFlight = null;
		return ensureCsrfToken();
	})().finally(() => {
		resetTokenInFlight = null;
	});
	return resetTokenInFlight;
}
